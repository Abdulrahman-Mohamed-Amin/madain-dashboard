import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {  tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN = 'token'
  url: string = `${environment.apiUrl}/Auth/login`
  constructor(private http: HttpClient) { }

  login(endPoint:any){
    return this.http.post<any>(this.url , endPoint).pipe(tap(res => this.setToken(res.token)))
  }

  setToken(token:string){
    localStorage.setItem(this.TOKEN , token)
  }

  getToken(){
    return localStorage.getItem(this.TOKEN)
  }

  isLogged(){
    return !!this.getToken()
  }

  logout(){
    localStorage.removeItem(this.TOKEN)
  }
}
