import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

   url: string = `${environment.apiUrl}/ProjectStatus`
   constructor(private http: HttpClient) { }
 
   addStatu(endpoint: any) {
     return this.http.post<any>(this.url, endpoint)
   }
 
   getStatus() {
     return this.http.get<any>(this.url)
   }
   deleteStatu(id: number) {
     return this.http.delete(this.url + `/${id}`)
   }
   updateStatu(id: number , endPoint:any) {
     return this.http.put(this.url + `/${id}` , endPoint)
   }
}
