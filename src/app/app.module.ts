import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FilterComponent } from './components/filter/filter.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HttpClientModule } from '@angular/common/http';
import { TreeModule } from 'ng2-tree';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from './components/chart/chart.component';
import { AddRecordComponent } from './components/add-record/add-record.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    ChartComponent,
    AddRecordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TreeModule,
    AgGridModule.withComponents([]),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
