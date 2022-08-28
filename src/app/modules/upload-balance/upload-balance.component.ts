import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Reader, Row} from "../../core/lib/reader";
import {XlxsReader} from "../../core/lib/xlxs-reader";
import {TsvReader} from "../../core/lib/tsv-reader";
import {Mime} from "../../core/constants";
import {Account} from "../../core/models/entities/account";
import {CoreService} from "../../core/services/core.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Entry} from "../../core/models/entities/entry";
import {Observable} from "rxjs";

type ImportedAccount = Account & { valid: boolean }

@Component({
  selector: 'app-upload-balance',
  templateUrl: './upload-balance.component.html',
  styleUrls: ['./upload-balance.component.css']
})
export class UploadBalanceComponent implements OnInit {

  @ViewChild('fileUploadControl') fileUploadControl?: ElementRef<HTMLInputElement>;
  @ViewChild('reviewCard') reviewCard?: ElementRef<HTMLElement>;

  public accountNamesIdsMap: Map<string, number> = new Map();
  public importedAccounts: ImportedAccount[] = [];
  public allowUpload = false;

  constructor(private _coreService: CoreService, private _snackbar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fetchAccountNames().subscribe(this.setAccountNamesIdsMap.bind(this));
  }

  // Fetch accounts and sets to the accounts state.
  public fetchAccountNames(): Observable<Account[]> {
    return new Observable<Account[]>(subscriber => {
      this._coreService.getAccounts()
        .subscribe({
          next: accounts => {
            subscriber.next(accounts);
            subscriber.complete();
          },
          error: _ => this._snackbar.open('Something went wrong while fetching accounts')
        });

    });
  }

  public setAccountNamesIdsMap(accounts: Account[]) {
    accounts.forEach(({name, id}) => this.accountNamesIdsMap.set(name, id))
  }

  private processFile(file: File) {
    let reader: Reader;

    if (file.type === Mime.Excel) {
      reader = new XlxsReader();
    } else if (file.type === Mime.PlainText) {
      reader = new TsvReader();
    } else {
      this._snackbar.open('Unsupported file type');
      return;
    }

    // todo: handle unsub
    reader.read(file).subscribe(grid => {
      const [isValid, errorMessage] = this.validateGridFormat(grid);

      if (!isValid) {
        this._snackbar.open(errorMessage);
        this.fileUploadControl!.nativeElement!.value = '';
        return;
      }

      // remove the header row from the grid
      grid.shift();

      this.importedAccounts = grid.map<ImportedAccount>(row => ({
        id: this.accountNamesIdsMap.get(row[0].toString()) ?? 0,
        name: row[0].toString(),
        balance: Number(row[1]),
        valid: this.accountNamesIdsMap.has(row[0].toString())
      }));

      this.allowUpload = this.isAllImportedAccountsValid(this.importedAccounts);
      setTimeout(() => this.reviewCard?.nativeElement.scrollIntoView({
        behavior: 'smooth'
      }), 0);
    });
  }

  public removeImportedAccount(index: number) {
    this.importedAccounts.splice(index, 1);
    this.allowUpload = this.isAllImportedAccountsValid(this.importedAccounts);
  }


  //-------------------------------------------------- utils -------------------------------------------------------- //

  private isAllImportedAccountsValid(accounts: ImportedAccount[]): boolean {
    return accounts.filter(x => !x.valid).length === 0;
  }

  private validateGridFormat(grid: Row[]): [boolean, string] {
    if (grid.length === 0)
      return [false, 'Empty rows'];

    if (grid[0].length !== 2)
      return [false, `Expected ${2} columns, received ${grid[0].length} columns`];

    if (grid[0][0].toString().toLowerCase() !== 'account')
      return [false, 'First column must be Account'];

    if (grid[0][1].toString().toLowerCase() !== 'balance')
      return [false, 'Second column must be Balance'];

    for (const [i, row] of grid.entries()) {
      if (i === 0) continue;  // ignore header row

      if (row.length !== 2) {
        return [false, `Expected ${2} columns, received ${row.length} columns`];
      }

      if (typeof row[0] !== "string") {
        return [false, `Found an invalid value for the account at row ${i + 1}`];
      }

      if (typeof row[1] !== "number") {
        return [false, `Found an invalid value for the balance at row ${i + 1}`];
      }
    }

    return [true, ''];
  }


  // ------------------------------------------ ui event handlers --------------------------------------------------- //

  public onSubmit() {
    const entries = this.importedAccounts.map<Entry>(account => ({
      accountId: account.id,
      amount: account.balance
    }));

    this._coreService.addEntries(entries).subscribe(_ => {
      this.importedAccounts = [];
      this.allowUpload = false;
      this._snackbar.open('Upload balances successfully!');
    });
  }

  public onDragStart(event: DragEvent) {
    (event.target as HTMLElement).classList.add('drag-enter');
  }

  public onDragEnd(event: DragEvent) {
    (event.target as HTMLElement).classList.remove('drag-enter');
  }

  public onDrop(event: DragEvent) {
    event.preventDefault();
    (event.target as HTMLElement).classList.remove('drag-enter');

    const type = event.dataTransfer?.files[0]?.type;
    if (type !== Mime.Excel && type !== Mime.PlainText) {
      this._snackbar.open('File type must be .txt or .xlsx');
    }

    this.processFile(event.dataTransfer!.files[0]);
  }

  public onFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file == null) {
      this._snackbar.open('Please select a file');
      return;
    }

    this.processFile(file);
  }

  public downloadTemplate(template: 'excel' | 'text') {
    let templatePath = ''
    let filename = '';

    if (template === 'excel') {
      templatePath = 'assets/templates/template.xlsx';
      filename = 'template.xlsx'
    } else {
      templatePath = 'assets/templates/template.txt';
      filename = 'template.txt'
    }

    fetch(templatePath)
      .then(response => response.blob())
      .then(blob => this.downloadBlob(blob, filename));
  }

  private downloadBlob(blob: Blob, name: string) {
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name;

    document.body.appendChild(link);

    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );

    document.body.removeChild(link);
  }
}
