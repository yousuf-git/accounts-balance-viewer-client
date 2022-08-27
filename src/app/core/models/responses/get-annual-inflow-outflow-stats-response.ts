export type GetAnnualInflowOutflowStatsResponse =
  {
    accountId: number,
    accountName: string,
    data: {
      year: number,
      change: number
    }[]
  }[]
