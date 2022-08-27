export enum UserRole {
  Admin = 'admin',
  User = 'user'
}

export enum Routes {
  Auth = 'auth',
  UploadBalance = 'upload-balance',
  ViewBalance = 'view-balance',
  Reports = 'reports'
}

export enum Endpoints {
  Auth = 'auth',
  FetchAccounts = 'accounts',
  AddEntries = 'entries',
  FetchMonthlyInflowOutflowStats = 'stats/balance-change-by-months',
  FetchAnnualInflowOutflowStats = 'stats/balance-change-by-years',
  FetchMonthlyAccumulationStats = 'stats/balance-by-months',
  FetchAnnualAccumulationStats = 'stats/balance-by-years',
  FetchFirstOperationYear = 'stats/first-operation-year'
}

export enum Mime {
  Excel = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PlainText = 'text/plain'
}
