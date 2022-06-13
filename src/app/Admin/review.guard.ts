
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../Services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewGuard implements CanActivate {

  constructor(private login : LoginService, private rotuer : Router){
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.login.getToken() == undefined || this.login.getToken() == ""){
      this.rotuer.navigate(["map"])
      return false
    }else{
      return true
    }
  }

}
