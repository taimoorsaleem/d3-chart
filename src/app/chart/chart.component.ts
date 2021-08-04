import { Component, OnInit, Input, ElementRef, OnChanges } from '@angular/core';
import { IChart } from '../app.interface';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartDataSnapshot: Array<IChart> = [];
  @Input() chartDates: Array<Date> = [];

  chartData: Array<IChart> = [];
  date = null;
  selectedChart: string = '';

  private width = 700;
  private height = 700;
  private margin = 50;

  svg: any;
  svgInner: any;
  yTotalRevScale: any;
  yTotalVolScale: any;
  xScale: any;
  xAxis: any;
  yAxis: any;
  lineTotalRevGroup: any;
  lineTotalVolGroup: any;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any): void {
    if (changes.hasOwnProperty('chartDataSnapshot') && this.chartDataSnapshot.length) {
      this.chartData = this.chartDataSnapshot;
      this.initializeChart();
      this.drawChart();
      
      window.addEventListener('resize', () => this.drawChart());
    }
  }

  /**
   * @name initializeChart
   * @desc create chat data
   * @param
   * @returns {void}
   */
  private initializeChart(): void {
    if (!this.chartData.length) {
      return;
    }
    if (this.svg) {
      d3
        .select(this.elementRef.nativeElement)
        .select('.linechart')
        .select("svg").remove();
    }

    this.svg = d3
      .select(this.elementRef.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this.height);
    this.svgInner = this.svg
      .append('g')
      .style('transform', 'translate(' + this.margin + 'px, ' + this.margin + 'px)');

    this.yTotalRevScale = d3
      .scaleLinear()
      .domain([(d3.max(this.chartData, (data: IChart) => data.total_rev) || 2) + 1, (d3.min(this.chartData, (data: IChart) => data.total_rev) || 2) - 1])
      .range([0, this.height - 2 * this.margin])
      .nice();

    this.yTotalVolScale = d3
      .scaleLinear()
      .domain([(d3.max(this.chartData, (data: IChart) => data.total_vol) || 2) + 1, (d3.min(this.chartData, (data: IChart) => data.total_vol) || 2) - 1])
      .range([0, this.height - 2 * this.margin])
      .nice();

    this.yAxis = this.svgInner
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this.margin + 'px,  0)');

    const domainDate: Array<any> = d3.extent(this.chartData, (data: IChart) => data.date);
    this.xScale = d3.scaleTime().domain(domainDate);


    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this.height - 2 * this.margin) + 'px)');

    this.lineTotalRevGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'red')
      .style('stroke-width', '2px')


    this.lineTotalVolGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line2')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .style('stroke-width', '2px')
  }

  /**
   * @name drawChart
   * @desc render chart data
   * @param
   * @return {void}
   */
  private drawChart(): void {
    this.width = this.elementRef.nativeElement.getBoundingClientRect().width;
    this.svg.attr('width', this.width);

    this.xScale.range([this.margin, this.width - 2 * this.margin]);

    const formatter: any = d3.timeFormat('%m / %Y');
    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(10)
      .tickFormat(formatter);
    this.xAxis.call(xAxis);

    const yAxis = d3
      .axisLeft(this.yTotalRevScale);
    this.yAxis.call(yAxis);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);

    if (!this.selectedChart || this.selectedChart === 'total_rev') {
      const points: [number, number][] = this.chartData
        .map((data: IChart) => [
          this.xScale(data.date),
          this.yTotalRevScale(data.total_rev),
        ]);
      this.lineTotalRevGroup.attr('d', line(points));
    }
    if (!this.selectedChart || this.selectedChart === 'total_vol') {
      const points2: [number, number][] = this.chartData
        .map((data: IChart) => [
          this.xScale(data.date),
          this.yTotalVolScale(data.total_vol),
        ]);
      this.lineTotalVolGroup.attr('d', line(points2));
    }
  }


  /**
   * @name onChange
   * @desc handle date range and update chart according to date range
   * @param [startDate, endDate]
   * @return {void} 
   */
  onChangeRangeHandler([startDate, endDate]: Array<Date>): void {
    const data = this.chartDataSnapshot.filter((chart: IChart) => this.checkInDatesRange(chart.date, startDate, endDate))
    this.chartData = data;
    this.initializeChart();
    this.drawChart();
  }

  /**
   * @name checkInDatesRange
   * @desc check current date is in range of provided range
   * @param currentDate 
   * @param startDate 
   * @param endDate 
   * @returns {boolean}
   */
  checkInDatesRange(currentDate: Date, startDate: Date, endDate: Date): boolean {
    return currentDate.getTime() >= startDate.getTime() && currentDate.getTime() <= endDate.getTime()
  }

  /**
   * @name disabledDate
   * @desc disable out of range date in calender
   * @param current 
   * @returns {boolean}
   */
  disabledDate = (current: Date): boolean => {
    return !this.checkInDatesRange(current, this.chartDates[0], this.chartDates[this.chartDates.length - 1])
  };

  /**
   * @name downloadImage
   * @desc download chart svg
   * @param
   * @return {void}
   */
  downloadImage(): void {
    const html: any = d3
      .select(this.elementRef.nativeElement)
      .select('.linechart')
      .select("svg")
      .attr("title", "svg_title")
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node();
    const a = document.createElement("a");
    a.href = "data:image/svg+xml;base64,\n" + btoa(unescape(encodeURIComponent(html.parentNode.innerHTML)))
    a.download = `image-${new Date().getTime()}.svg`;
    a.click();
    a.remove();
  }

  /**
   * @name chartChangeHandler
   * @desc update chat selection and rerender chart
   * @param
   * @return {void}
   */
  chartChangeHandler(event: string): void {
    console.log(this.selectedChart, event);
    this.selectedChart = event;
    this.initializeChart();
    this.drawChart();
  }
}
