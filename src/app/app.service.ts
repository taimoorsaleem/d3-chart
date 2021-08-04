import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IChart, IStock, IStockAggregateResponse } from './app.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private http: HttpClient) { }

  fetchStockAggregate(): Observable<IStockAggregateResponse> {
    return this.http.get('assets/aggregated_stock_exchange.csv', {
      responseType: 'text'
    })
      .pipe(
        map((responseText: string) => {
          const [, ...rowData]: Array<string> = responseText.trim().split("\n");
          const dates: Array<Date> = [];
          return {
            dates,
            data: rowData.map((row: string) => {
              const [date, total_rev, total_vol] = row.split(',');
              dates.push(new Date(date));
              return {
                date: new Date(date),
                total_rev: Number(total_rev),
                total_vol: Number(total_vol)
              }
            }),
          }
        })
      );
  }

  fetchStockData(): Observable<Array<IStock>> {
    return this.http.get('assets/stock_data.csv', {
      responseType: 'text'
    })
      .pipe(
        map((responseText: string) => {
          const [, ...rowData]: Array<string> = responseText.trim().split("\n");
          return rowData.map((row: string) => {
            const [name, date, open_price, close_price, high_price, low_price, volume, market] = row.split(',');
            return {
              name,
              date: new Date(date),
              open_price: Number(open_price),
              close_price: Number(close_price),
              high_price: Number(high_price),
              low_price: Number(low_price),
              volume: Number(volume),
              market
            }
          });
        })
      );
  }
}

