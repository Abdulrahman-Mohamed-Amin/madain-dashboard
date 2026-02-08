import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { News } from '../../interfaces/news/new';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  url:string = `${environment.apiUrl}/News`
  constructor(private http:HttpClient) { }

  getNews(){
    return this.http.get<News[]>(this.url)
  }
  getById(id:number){
    return this.http.get<News>(`${this.url}/${id}`)
  }
  addNew(endPoint:FormData){
    return this.http.post<News>(this.url , endPoint)
  }

  editNew(id:number , endPoint:FormData){
    return this.http.put(`${this.url}/${id}`, endPoint)
  }

  deleteNew(id:number){
    return this.http.delete(`${this.url}/${id}`)
  }
}
