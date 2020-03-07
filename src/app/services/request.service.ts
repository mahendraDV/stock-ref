import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private baseUrl = "https://kapsarc-api.herokuapp.com";
  services = {
    getFilters:{
      url: '/filter-list',
      type: 'GET'
    },
    getRecords:{
      url: '/',
      type: 'GET'
    },
    updateRecord:{
      url: '/',
      type: 'PUT'
    },
    postRecord:{
      url: '/',
      type: 'POST'
    },
    deleteRecord:{
      url: '/',
      type: 'DELETE'
    },
    getChart:{
      url: '/chart',
      type: 'GET'
    }
  };

  constructor(private http: HttpClient) {}

  send(serviceName, options){
    let _request = this.services[serviceName];
    if(!_request) return Promise.reject({ msg: 'service doesn\'t exsist', status: 404 });

    return this.http.request(
      _request['type'],
      this.baseUrl + _request['url'],
      {
          body: _request['type'] != "GET" ? options :{},
          params: _request['type'] == "GET" ? options :{}
      })
      .toPromise()
      .then(res =>{ return res })
      .catch(e=>{ throw(e) })
  }
}
