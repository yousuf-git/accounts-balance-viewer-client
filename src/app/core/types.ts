export interface EChartSeriesOptions {
  name?: string,
  type?: string,
  data?: number[],
  animationDelay?: (idx: number) => number
}
