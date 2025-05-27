export type TimeSeries = {
  meta: TimeSeriesMeta;
  status: string;
  values: TimeSeriesValue[];
};

type TimeSeriesMeta = {
  currency_base: string;
  currency_quote: string;
  interval: string;
  symbol: string;
  type: string;
};

type TimeSeriesValue = {
  close: string;
  datetime: string;
  high: string;
  low: string;
  open: string;
};

export type Price = {
  currency_base: string;
  currency_quote: string;
  event: string;
  exchange: string;
  price: number;
  symbol: string;
  timestamp: number;
  type: string;
  ask?: number;
  bid?: number;
  mic_code?: string;
};
