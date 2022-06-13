import { HttpClient } from '@angular/common/http';
import { LoginResponse, VerifyToken } from './../structs/Login';
import { Injectable } from '@angular/core';
import { Login } from '../structs/Login';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private token : string | undefined = undefined

  constructor(private http : HttpClient, private cookies : CookieService) { }

  login(login : Login){
    return this.http.post<LoginResponse>(environment.apiURL+`/login`, login)
  }

  verifyToken(){
    let tkn : VerifyToken = new VerifyToken
    tkn.token = this.token
    return this.http.post<LoginResponse>(environment.apiURL+`/verify`, tkn)
  }

  setToken(token : string|undefined){
    this.token = token
  }

  getToken(){
    return this.token
  }

  saveLogin(){
    this.cookies.set("token", this.token!, 30, "/")
  }
}
