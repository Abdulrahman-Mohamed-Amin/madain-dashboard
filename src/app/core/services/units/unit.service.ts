import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Unit } from '../../interfaces/project/project';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  url = `${environment.apiUrl}/Unit`
  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get(this.url)
  }
  getById(id:number){
    return this.http.get<Unit>(`${this.url}/${id}`)
  }
  add(endPoint:FormData){
    return this.http.post(this.url , endPoint)
  }

  edit(id:number , endPoint:FormData){
    return this.http.put(`${this.url}/${id}` , endPoint)
  }
  
  delete(id:number){
    return this.http.delete(`${this.url}/${id}`)
  }
}
