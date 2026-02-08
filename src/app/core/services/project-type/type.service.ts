import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  url: string = `${environment.apiUrl}/ProjectType`
  constructor(private http: HttpClient) { }

  addType(endpoint: any) {
    return this.http.post<any>(this.url, endpoint)
  }

  getTypes() {
    return this.http.get<any>(this.url)
  }
  deleteType(id: number) {
    return this.http.delete(this.url + `/${id}`)
  }
  updateType(id: number , endPoint:any) {
    return this.http.put(this.url + `/${id}` , endPoint)
  }
}
