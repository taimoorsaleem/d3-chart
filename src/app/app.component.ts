import { Component, OnInit, ElementRef } from '@angular/core';
import { AppService } from './app.service';
import { IChart, IStock, IStockAggregateResponse } from './app.interface';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  stockData: Array<IStock> = []
  stockDataLoading: boolean = false;
  chartData: Array<IChart> = [];
  chartDates: Array<Date> = [];

  constructor(private appService: AppService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.stockDataLoading = true;
    this.appService.fetchStockAggregate()
      .subscribe(
        (response: IStockAggregateResponse) => {
          this.chartData = response.data;
          this.chartDates = response.dates;
        },
        error => {
          /** 
           * Error handler
           */
        },
      );
    this.appService.fetchStockData()
      .subscribe(
        (response: Array<IStock>) => {
          this.stockData = response;
        },
        error => {
          /** 
           * Error handler
           */
        },
        () => {
          this.stockDataLoading = false;
        }
      );
  }
}
