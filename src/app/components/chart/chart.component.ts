import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  options: any = {
      chart: {
          type: 'line',
          height: 500
      },
      credits: {
          enabled: false
      },
      tooltip: {
          formatter: function () {
              return 'Year: ' + this.x + ' Average: ' + this.y;
          }
      },
      xAxis: { categories: []},
      series: []
  };

  records: Array<object> = [];
  columns: Array<string> = [];

  constructor(private request: RequestService){}

  ngOnInit() {
    this.getChart();
  }

  getChart(){
    this.request.send('getChart', {})
        .then((s)=>{
          this.records = s['records'];
          this.columns = s['columns'];

          let obj = this.columns.reduce((c, x) => {
            c[x] = [];
            return c;
          }, {})
          obj['date'] = [];

          let x = this.records.reduce((c, v) => {
            c['date'].push(v['date']);
            this.columns.forEach(i=> c[i].push(v[i]))
            return c;
          }, obj);

          for (let [key, value] of Object.entries(x)) {
            if(key != "date")
              this.options.series.push({ name: key, data: value})
          }
          this.options.xAxis['categories'] = x['date'];
          Highcharts.chart('container', this.options);
        })
  }
}
