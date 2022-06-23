import { LoginService } from './Services/login.service';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DaokoMap';
  lang = "en"
  constructor(private cookies: CookieService, private loginService : LoginService, private ngxTranslate : TranslateService){
    this.ngxTranslate.use(this.lang)
    if(this.ngxTranslate.getBrowserLang() != undefined){
      this.ngxTranslate.use(this.ngxTranslate.getBrowserLang()!)
    }
    this.loginService.setToken(this.cookies.get("token"))
    this.loginService.verifyToken().subscribe({
      next : (res)=>{
        if(res.InternalCode != "I_TokenAccepted"){
          this.cookies.delete("token")
          this.loginService.setToken(undefined)
        }
      },
      error: (err)=>{
        this.cookies.delete("token")
        this.loginService.setToken(undefined)
      }
    })
    this.loginService.verifyToken().subscribe(res=>{

    })
  }
  setIdioma(lang : string){
    this.ngxTranslate.use(lang)
  }
}
