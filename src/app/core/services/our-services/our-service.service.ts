import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service } from '../../interfaces/service/service';

@Injectable({
  providedIn: 'root'
})
export class OurServiceService {
  url:string = `${environment.apiUrl}/Service`

  constructor(private http:HttpClient) { }

  getService(){
    return this.http.get<Service[]>(this.url)
  }
  addService(id:any){
    return this.http.post(this.url , id)
  }

  deeletService(id:number){
    return this.http.delete(`${this.url}/${id}`)
  }

  editService(endPoint:any , id:number){
    return this.http.put(`${this.url}/${id}` , endPoint)
  }
  
}
