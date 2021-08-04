import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Antd Modules
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTransButtonModule } from 'ng-zorro-antd/core/trans-button';
import { NzIconModule } from 'ng-zorro-antd/icon';
// Components
import { StockTableComponent } from './stock-table/stock-table.component';
// Services
import { AppService } from './app.service';
import { ChartComponent } from './chart/chart.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    StockTableComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // Antd Module
    NzLayoutModule,
    NzTableModule,
    NzDatePickerModule,
    NzGridModule,
    NzRadioModule,
    NzButtonModule,
    NzTransButtonModule,
    NzIconModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
