import {Component, OnInit} from '@angular/core';
import {CoreService} from "../../core/services/core.service";
import {Account} from "../../core/models/entities/account";

@Component({
  selector: 'app-view-balance',
  templateUrl: './view-balance.component.html',
  styleUrls: ['./view-balance.component.css']
})
export class ViewBalanceComponent implements OnInit {

  public accounts: Account[] = [];
  public todayDate: Date = new Date();

  constructor(private coreService: CoreService) {
  }

  ngOnInit(): void {
    this.coreService.getAccounts().subscribe(value => this.accounts = value);
  }

}
