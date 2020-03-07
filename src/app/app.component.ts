import { Component, OnInit } from '@angular/core';
import { RequestService } from './services/request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  gridApi;
  gridColumnApi;

  isLoading: boolean = true;
  records: Array<object> = [];
  columns: Array<object> = [];
  _cols: Array<string> = [];
  recordsCount: number = 0;
  page: number = 0;
  filters: object = {};

  constructor(private request: RequestService){}

  ngOnInit(){
    this.getRecords()
  }

  /*
    Data
  */
  getRecords(){
    this.isLoading = true;
    this.request.send('getRecords', this.filters)
        .then((s)=>{
          this._cols = s['columns'].filter((x)=>{ return x !== 'Date' });
          this.columns = s['columns'].map(i =>{
            let obj = {
              headerName: i,
              field: i.replace(/\./g,''),
              sortable: true,
              suppressMovable: true
            }
            if(i != 'Date'){
              obj['editable'] = true;
            }
            return obj
          });
          this.records = s['records'].map(i =>{
            let obj = i['record'].reduce((o, j) => (o[j['name'].replace(/\./g,'')] = j['price'], o) ,{});
                obj['Date'] = this.formatDate(i['date']);
                obj['id'] = i['_id'];
            return obj
          });
          this.recordsCount = s['count'][0]['count'];
        })
        .catch((e)=>{ console.log(e) })
        .finally(()=> this.isLoading = false )
  }

  editRow(e){
    if(e.oldValue == e.newValue) return;
    // TODO: reverse UI change when value doesn't match regex
    if(!e.newValue.match(/^\d{0,2}(?:\.\d{0,3}){0,1}$/)) return;

    let data = {
      id: e.data.id,
      name: e.colDef.headerName,
      value: parseFloat(e.newValue)
    }
    // TODO: notify user that record is updated
    this.request.send('updateRecord', data)
  }

  deleteRow(){
    let selected = this.gridApi.getSelectedRows();
    if(selected.length < 1) return;

    this.gridApi.updateRowData({ remove: selected });
    // TODO: notify user that record is deleted
    this.request.send('deleteRecord', { id: selected[0]['id'] });
  }

  /*
      Filters
  */
  setFilters(e){
    this.filters = e;
    this.getRecords();
  }

  /*
      Table Methods
  */
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  sizeColumnsToFit(){
    this.gridApi.sizeColumnsToFit();
  }

  /*
    Helpers
  */
  formatDate(date){
    return new Date(date).toDateString();
  }

}
