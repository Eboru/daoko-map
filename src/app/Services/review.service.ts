import { HttpClient } from '@angular/common/http';
import { GetTasks, GetTasksResposne } from './../structs/Review';

import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private login : LoginService, private http : HttpClient) { }

  getTasks(){
    let sesion : GetTasks = new GetTasks
    sesion.token = this.login.getToken()!
    return this.http.post<GetTasksResposne>(environment.apiURL+`/review`, sesion)
  }
}
