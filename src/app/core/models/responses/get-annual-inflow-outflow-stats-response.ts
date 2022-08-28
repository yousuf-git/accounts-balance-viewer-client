export type GetAnnualInflowOutflowStatsResponse =
  {
    accountId: number,
    accountName: string,
    minYear: number,
    data: {
      year: number,
      change: number
    }[]
  }[]
