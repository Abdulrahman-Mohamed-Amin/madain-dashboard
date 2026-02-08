import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/AUth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  constructor(private _authService:AuthService , private router:Router){
  }

  ngOnInit(): void {
    console.log(this._authService.isLogged());
    
  }
  
  login(){
    
    this._authService.login({userName:'admin' , password:"123456"}).subscribe(res =>{
      this.router.navigateByUrl('dashboard')
    })
  }
}
