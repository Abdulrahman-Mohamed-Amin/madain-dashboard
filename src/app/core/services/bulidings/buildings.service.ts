import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Build } from '../../interfaces/building/build';

@Injectable({
  providedIn: 'root'
})
export class BuildingsService {
  url = environment.apiUrl + "/Building"
  constructor(private http:HttpClient) { }

  getBuildings(){
    return this.http.get<any>(this.url)
  }
  getById(id:number){
    return this.http.get<Build>(`${this.url}/${id}`)
  }

  add(endpoint:FormData){
    return this.http.post(this.url , endpoint)
  }

  edit(id:number , endpoint:FormData){
    return this.http.put(`${this.url}/${id}` , endpoint)
  } 

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`)
  }
}
