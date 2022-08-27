export type GetMonthlyAccumulationStatsResponse =
  {
    accountId: number,
    accountName: string,
    data: {
      month: number,
      balance: number
    }[]
  }[]
