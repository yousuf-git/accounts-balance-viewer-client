export type GetAnnualAccumulationStatsResponse =
  {
    accountId: number,
    accountName: string,
    data: {
      year: number,
      balance: number
    }[]
  }[]
