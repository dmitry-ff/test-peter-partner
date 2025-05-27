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
  type: "Physical Currency";
};

type TimeSeriesValue = {
  close: string;
  datetime: string;
  high: string;
  low: string;
  open: string;
};
