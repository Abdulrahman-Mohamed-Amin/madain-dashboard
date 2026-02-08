import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Project } from '../../interfaces/project/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  url:string = environment.apiUrl + '/Project'
  constructor(private http:HttpClient) { }

  getAllProjects(){
    return this.http.get<any[]>(this.url)
  }

  getById(id:number){
    return this.http.get<Project>(`${this.url}/${id}`)
  }

  add(endpoint:FormData){
    return this.http.post(this.url , endpoint)
  }

  edit(id:number , endPoint:FormData){
    return this.http.put(`${this.url}/${id}` , endPoint)
  }

  delete(id:number){
    return this.http.delete(`${this.url}/${id}`)
  }
}
