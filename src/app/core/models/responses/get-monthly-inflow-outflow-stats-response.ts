export type GetMonthlyInflowOutflowStatsResponse =
  {
    accountId: number,
    accountName: string,
    data: {
      month: number,
      change: number
    }[]
  }[]
