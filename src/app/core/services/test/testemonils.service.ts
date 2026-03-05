import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestemonilsService {
  url = environment.apiUrl + '/TastyMonions'
  constructor(private http:HttpClient) { }

  add(endPoint:any){
    return this.http.post(this.url , endPoint)
  }

  get(){
    return this.http.get<any>(this.url)
  }

  delete(id:number){
    return this.http.delete(this.url + "/" + id)
  }
}
