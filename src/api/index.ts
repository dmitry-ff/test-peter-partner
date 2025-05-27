import type { TimeSeries } from "../types/api.ts";

export const getEndOfDayAPI = async (symbol: string): Promise<TimeSeries> => {
  const response = await fetch(
    `https://api.twelvedata.com/time_series?symbol=${symbol}&outputsize=1&interval=1day&apikey=${import.meta.env.VITE_API_KEY}`,
  );
  return await response.json();
};
