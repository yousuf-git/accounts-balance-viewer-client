import {ViewBalanceComponent} from './view-balance.component';
import {CoreService} from "../../core/services/core.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {of} from "rxjs";
import {GetAccountsResponse} from "../../core/models/responses/get-accounts-response";
import {Account} from "../../core/models/entities/account";

const getTestAccounts = (): Account[] => [
  {id: 10, name: 'R&D', balance: 100_000.50},
  {id: 14, name: 'Cash', balance: 250_000.25},
  {id: 24, name: 'Operations', balance: 50_000.00}
];

describe('ViewBalanceComponent', () => {
  let fakeCoreService: jasmine.SpyObj<CoreService>;
  let fakeMatSnackBar: jasmine.SpyObj<MatSnackBar>;
  let component: ViewBalanceComponent;

  beforeEach(() => {
    fakeCoreService = jasmine.createSpyObj<CoreService>('CoreService', {
      getAccounts: of([]),
      addEntries: of({})
    });
    fakeMatSnackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', {
      open: undefined
    });
    component = new ViewBalanceComponent(fakeCoreService, fakeMatSnackBar);
  });

  it('fetches accounts', () => {
    const accounts: GetAccountsResponse = getTestAccounts();

    fakeCoreService.getAccounts.and.returnValue(of(accounts));

    // act
    const result = component.fetchAccounts();

    // assert
    result.subscribe(value => expect(value).toEqual(accounts));
  });

  it('invokes core service to fetch accounts', () => {
    const accounts: GetAccountsResponse = getTestAccounts();

    fakeCoreService.getAccounts.and.returnValue(of(accounts));

    // act
    const result = component.fetchAccounts();

    // assert
    expect(fakeCoreService.getAccounts.calls.count()).toBe(1);
  });

  it('sets accounts', () => {
    const accounts: GetAccountsResponse = getTestAccounts();

    // act
    component.setAccounts(accounts);

    // assert
    expect(component.accounts).toEqual(accounts);
  });

});
