import {UploadBalanceComponent} from './upload-balance.component';
import {CoreService} from "../../core/services/core.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {of} from "rxjs";
import {GetAccountsResponse} from "../../core/models/responses/get-accounts-response";
import {Account} from "../../core/models/entities/account";
import {Row} from "../../core/lib/reader";

const getTestAccounts = (): Account[] => [
  {id: 10, name: 'R&D', balance: 100_000.50},
  {id: 14, name: 'Cash', balance: 250_000.25},
  {id: 24, name: 'Operations', balance: 50_000.00}
];

describe('UploadBalanceComponent', () => {
  let fakeCoreService: jasmine.SpyObj<CoreService>;
  let fakeMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let component: UploadBalanceComponent;

  beforeEach(() => {
    fakeCoreService = jasmine.createSpyObj<CoreService>('CoreService', {
      getAccounts: of([]),
      addEntries: of({})
    });
    fakeMatSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', {
      open: undefined
    });
    component = new UploadBalanceComponent(fakeCoreService, fakeMatSnackBar);
  });

  it('fetches account names', () => {
    const accounts: GetAccountsResponse = getTestAccounts();

    fakeCoreService.getAccounts.and.returnValue(of(accounts));

    // act
    const result = component.fetchAccountNames();

    // assert
    result.subscribe(value => expect(value).toEqual(accounts));
  });

  it('calls core service to fetch account names', async () => {
    const accounts: GetAccountsResponse = getTestAccounts();

    fakeCoreService.getAccounts.and.returnValue(of(accounts));

    // act
    const result = component.fetchAccountNames();

    // assert
    result.subscribe(_ => expect(fakeCoreService.getAccounts.calls.count()).toBe(1));
  });

  it('maps account ids to account names', () => {
    const accounts: Account[] = getTestAccounts();

    const expected = new Map([
      [accounts[0].name, accounts[0].id],
      [accounts[1].name, accounts[1].id],
      [accounts[2].name, accounts[2].id],
    ]);

    // act
    component.setAccountNamesIdsMap(accounts);

    // assert
    expect(component.accountNamesIdsMap).toEqual(expected);
  });

  it('removes imported account', () => {
    const importedAccounts = getTestAccounts();

    component.importedAccounts = JSON.parse(JSON.stringify(importedAccounts));

    // act
    component.removeImportedAccount(1);

    // assert
    expect(component.importedAccounts.length).toBe(importedAccounts.length - 1);
    expect(component.importedAccounts[0].id).toBe(importedAccounts[0].id);
    expect(component.importedAccounts[1].id).toBe(importedAccounts[2].id);
  });

  it('on submission invokes core service', () => {
    const importedAccounts = getTestAccounts();

    component.importedAccounts = JSON.parse(JSON.stringify(importedAccounts));

    // act
    component.onSubmit();

    // assert
    expect(fakeCoreService.addEntries.calls.count()).toBe(1);
  });

  it('returns true as all imported accounts are valid', () => {
    const importedAccounts = [
      {id: 10, name: 'R&D', balance: 100_000.50, valid: true},
      {id: 14, name: 'Cash', balance: 250_000.25, valid: true},
      {id: 24, name: 'Operations', balance: 50_000.00, valid: true},
    ];

    component.importedAccounts = JSON.parse(JSON.stringify(importedAccounts));

    // act
    const result = component['isAllImportedAccountsValid'].call(component, importedAccounts);

    // assert
    expect(result).toBe(true);
  });

  it('returns false as not all imported accounts are valid', () => {
    const importedAccounts = [
      {id: 10, name: 'R&D', balance: 100_000.50, valid: true},
      {id: 14, name: 'Cash', balance: 250_000.25, valid: false},
      {id: 24, name: 'Operations', balance: 50_000.00, valid: false},
    ];

    component.importedAccounts = JSON.parse(JSON.stringify(importedAccounts));

    // act
    const result = component['isAllImportedAccountsValid'].call(component, importedAccounts);

    // assert
    expect(result).toBe(false);
  });

  it('returns true for valid grid format', () => {
    const grid: Row[] = [
      ['Account', 'Balance'],
      ['R&D', 100_000],
      ['Equipment', 330_000],
      ['Infrastructure', 180_000],
      ['Other', 220_000],
    ];

    // act
    const [result] = component['validateGridFormat'].call(component, grid);

    // assert
    expect(result).toBe(true);
  });

  it('validates empty grid', () => {
    const grid: Row[] = [];

    // act
    const [result] = component['validateGridFormat'].call(component, grid);

    // assert
    expect(result).toBe(false);
  });

  it('validates grid with unexpected header column counts', () => {
    const grid: Row[] = [
      ['Account', 'Balance', 'New Column'],
      ['R&D', 100_000],
      ['Equipment', 330_000],
      ['Infrastructure', 180_000],
      ['Other', 220_000],
    ];

    // act
    const [result] = component['validateGridFormat'].call(component, grid);

    // assert
    expect(result).toBe(false);
  });

  it('validates grid with unexpected account header name', () => {
    const grid: Row[] = [
      ['Name', 'Balance'],
      ['R&D', 100_000],
      ['Equipment', 330_000],
      ['Infrastructure', 180_000],
      ['Other', 220_000],
    ];

    // act
    const [result] = component['validateGridFormat'].call(component, grid);

    // assert
    expect(result).toBe(false);
  });

  it('validates grid with unexpected balance header name', () => {
    const grid: Row[] = [
      ['Account', 'Amount'],
      ['R&D', 100_000],
      ['Equipment', 330_000],
      ['Infrastructure', 180_000],
      ['Other', 220_000],
    ];

    // act
    const [result] = component['validateGridFormat'].call(component, grid);

    // assert
    expect(result).toBe(false);
  });

  it('validates grid with unexpected column count in value rows', () => {
    const grid: Row[] = [
      ['Account', 'Balance'],
      ['R&D', 100_000, 200_500],
      ['Equipment', 330_000],
      ['Infrastructure', 180_000],
      ['Other', 220_000],
    ];

    // act
    const [result] = component['validateGridFormat'].call(component, grid);

    // assert
    expect(result).toBe(false);
  });

  it('validates grid with unexpected data type in account column', () => {
    const grid: Row[] = [
      ['Account', 'Balance'],
      ['R&D', 100_000],
      [99999, 330_000],
      ['Infrastructure', 180_000],
      ['Other', 220_000],
    ];

    // act
    const [result] = component['validateGridFormat'].call(component, grid);

    // assert
    expect(result).toBe(false);
  });

  it('validates grid with unexpected data type in balance column', () => {
    const grid: Row[] = [
      ['Account', 'Balance'],
      ['R&D', 100_000],
      ['Equipment', 'test_malicious_value'],
      ['Infrastructure', 180_000],
      ['Other', 220_000],
    ];

    // act
    const [result] = component['validateGridFormat'].call(component, grid);

    // assert
    expect(result).toBe(false);
  });
});
