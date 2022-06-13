import { LoginService } from './Services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DaokoMap';
  constructor(private cookies: CookieService, private loginService : LoginService){
    this.loginService.setToken(this.cookies.get("token"))
    this.loginService.verifyToken().subscribe(res=>{
      if(res.InternalCode != "I_TokenAccepted"){
        this.cookies.delete("token")
        this.loginService.setToken(undefined)
      }
    })
  }
}
