import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TreeModel, NodeEvent, TreeModelSettings } from 'ng2-tree';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() filter = new EventEmitter();
  @Input() recordsCount: number;
  @ViewChild('treeEl') public treeEl;

  treeSettings: TreeModelSettings = {
    isCollapsedOnInit: true,
    rightMenu: false,
  };

  filterList: TreeModel = {
    value: '',
    children: [],
    settings: this.treeSettings
  };
  searchkey;
  searchPattern = /^\d{0,2}(?:\.\d{0,3}){0,1}$/;
  activeFilters = [];
  isLoading;

  constructor(private request: RequestService){}

  ngOnInit(){
    this.getFilters()
  }

  getFilters(){
    this.isLoading = true;
    this.request.send('getFilters', {})
        .then((s)=>{
          this.filterList.children = Object.keys(s['filters']).map(y =>{
             return {
               value: y,
               id: y,
               children: s['filters'][y]['months']
             }
           });
        })
        .catch((e)=>{ console.log(e) })
        .finally(()=> this.isLoading = false )
  }

  /*
      Filters
  */
  removeFilter(filter, index){
    if(filter['src'] == 'dateList') this.handleActionOnFFS(filter.value, 'unselect');
    else if( filter['src'] == 'dateRenge'){}
    else if( filter['src'] == 'price') this.searchkey = null;

    this.activeFilters.splice(index, 1);
    this.emitChanges();
  }

  /* Date List Filters  */
  addFilter(e: NodeEvent){
    let index = this.activeFilters.findIndex(i =>{ return i['label'] == 'Date' });
    if(index == -1) {
      this.activeFilters.push({
        label: 'Date',
        value: e.node.id,
        src: 'dateList'
      })
    }
    else{
      if(e.node.id == this.activeFilters[index]['value']) return;
      this.activeFilters[index]['value'] = e.node.id;
      this.activeFilters[index]['src'] = 'dateList';
    }
    this.handleActionOnFFS(e.node.id, 'select');
    this.handleActionOnFFS(e.node.id, 'expandToParent');

    this.emitChanges();
  }

  handleActionOnFFS(id: number | string, action: string) {
    const treeController = this.treeEl.getControllerByNodeId(id);
    if (treeController && typeof treeController[action] === 'function') {
      treeController[action]();
    } else {
      console.log('There isn`t a controller for a node with id - ' + id);
    }
  }

  /* Search Input Filter */
  searchValue(){
    let index = this.activeFilters.findIndex(i =>{ return i['label'] == 'Value' });
    if(index == -1) this.activeFilters.push({
        label: 'Value',
        value: this.searchkey,
        src: 'price'
      })
    else this.activeFilters[index]['value'] = this.searchkey;
    this.emitChanges();
  }

  /*
      Parent Communication
  */
  emitChanges(){
    let _prefilter = this.activeFilters.reduce((obj, item) => (obj[item.src] = item.value, obj) ,{});
    console.log("Pre >>> ", _prefilter);
    let filter = {};

    if(_prefilter['price']) filter['price'] = _prefilter['price'];
    if(_prefilter['dateList']) filter['start'] = _prefilter['dateList'];
    if(_prefilter['range']) {
      let range = _prefilter['range'].split(' to ');
      filter['start'] = range[0];
      if(range[1]) filter['end'] = range[1];
    }

    this.filter.emit(filter);
  }
}
