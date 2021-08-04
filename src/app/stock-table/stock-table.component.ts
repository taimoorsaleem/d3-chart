import { Component, OnInit, Input } from '@angular/core';
import { IStock } from '../app.interface';

@Component({
  selector: 'app-stock-table',
  templateUrl: './stock-table.component.html',
  styleUrls: ['./stock-table.component.sass']
})
export class StockTableComponent implements OnInit {
  @Input() loading: boolean = false;
  @Input() stockData: Array<IStock> = [];
  pageIndex: number = 1;
  pageSize: number = 50;

  listOfColumns: any[] = [
    {
      name: 'Name',
      sortOrder: null,
      sortFn: null,
      sortDirections: [],
    },
    {
      name: 'Date',
      sortOrder: null,
      sortFn: (a: IStock, b: IStock) => a.date.getTime() - b.date.getTime(),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Open Price',
      sortOrder: null,
      sortFn: (a: IStock, b: IStock) => a.open_price - b.open_price,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Close Price',
      sortOrder: null,
      sortFn: (a: IStock, b: IStock) => a.close_price - b.close_price,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'High Price',
      sortOrder: null,
      sortFn: (a: IStock, b: IStock) => a.high_price - b.high_price,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Low Price',
      sortOrder: null,
      sortFn: (a: IStock, b: IStock) => a.low_price - b.low_price,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Volume',
      sortOrder: null,
      sortFn: (a: IStock, b: IStock) => a.volume - b.volume,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      name: 'Market',
      sortOrder: null,
      sortFn: null,
      sortDirections: []
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }

  /**
   * @name onPageSizeChange
   * @desc page size change handler
   * @param event 
   * @returns {void}
   */
  onPageSizeChange(event: number): void {
    this.pageSize = event;
  }

  /**
   * @name onPageIndexChange
   * @desc page index change handler
   * @param event 
   * @returns {void}
   */
  onPageIndexChange(event: number): void {
    this.pageIndex = event;
  }

  /**
   * @name downloadCSV
   * @desc download csv file of current table data
   * @param
   * @returns {void}
   */
  downloadCSV(): void {
    const replacer = (key: string, value: string) => (value === null ? '' : value);
    const csvHeader: Array<string> = Object.keys(this.stockData[0]);
    const csvBody = this.stockData
      .slice((this.pageIndex - 1) * this.pageSize, ((this.pageIndex - 1) * this.pageSize) + this.pageSize)
      .map((row: any) =>
      csvHeader
          .map((fieldName: any) => JSON.stringify(row[fieldName], replacer))
          .join(',')
      );
    csvBody.unshift(csvHeader.join(','));
    const csvArray = csvBody.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = `data-${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

}
