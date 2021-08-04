export interface IChart {
  date: Date;
  total_rev: number;
  total_vol: number
}

export interface IStock {
  name: string;
  date: Date;
  open_price: number;
  close_price: number;
  high_price: number;
  low_price: number;
  volume: number;
  market: string;
}

export interface IStockAggregateResponse {
  dates: Array<Date>,
  data: Array<IChart>
}