import { Post, PostResponse } from './../structs/Post';
import { MetaLocations, LocationDetail } from './../structs/MetaLocation';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(private http : HttpClient) { }

  getLocations(){
    return this.http.get<MetaLocations>(environment.apiURL+"/location")
  }

  getDetail(id : number){
    return this.http.get<LocationDetail>(environment.apiURL+`/location/${id}`)
  }

  postMessage(post: Post){
    return this.http.post<PostResponse>(environment.apiURL+`/post`, post)
  }

}
