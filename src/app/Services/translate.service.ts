import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateResponse } from '../structs/Translate';

@Injectable({
  providedIn: 'root'
})
export class GoogleTranslateService {

  constructor(private http : HttpClient) { }

  translate(message : string){
    return this.http.post<TranslateResponse>(`https://translation.googleapis.com/language/translate/v2?q=${encodeURIComponent(message)}&target=ja&format=text&key=AIzaSyAMAAcEJtgiRr6RfVcNMVAC5vwZvtvs9bo`, "")
  }
}
