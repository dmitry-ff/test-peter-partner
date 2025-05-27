import type { TimeSeries } from "../types/api.ts";

export const getCloseDataBySymbol = (
  data: TimeSeries[],
  symbol: string,
): TimeSeries["TimeSeriesValue"] | null => {
  return data.find((item) => item?.meta?.symbol === symbol)?.values[0] ?? null;
};
