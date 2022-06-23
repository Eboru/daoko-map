import { Post } from './../../structs/Post';
import { LocationsService } from './../../Services/locations.service';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy, AfterViewInit {
  private map: L.Map | undefined = undefined;
  private marker: L.Marker | undefined = undefined
  form : FormGroup
  openMap : boolean = true
  locationChoosed : boolean = false
  popError : boolean = false
  errorMessage : string = ""
  lat : string = ""
  lng : string = ""
  fullcoord : string = ""
  success: boolean = false
  disablePublish : boolean = false

  constructor(private builder : FormBuilder, private locations : LocationsService, private rotuer: Router, private ngxTranslate : TranslateService) {
    this.form = this.builder.group({
      Publisher : ["", Validators.required],
      Message : ["", Validators.required]
    })
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initMap()
    this.openMapFunc()
  }

  private initMap(): void {
    this.map = L.map('map2', {
      center: [35.652832, 139.839478],
      zoom: 2,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 2,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = iconDefault;
    this.marker = new L.Marker(this.map.getCenter()).addTo(this.map);
    this.map.addEventListener("move", (e)=>{
      this.marker?.setLatLng(this.map?.getCenter()!)
    })
   }

  submit(){
    let message : Post = new Post
    message.location = this.fullcoord
    message.message = this.form.get("Message")?.value
    message.publisher = this.form.get("Publisher")?.value
    this.disablePublish = true
    this.locations.postMessage(message).subscribe({
      next : (res)=>{
        this.disablePublish = false
        if(res.InternalCode != "I_Success"){
          return
        }
        this.success = true
      },
      error: (err)=>{
        this.popError = true
        this.disablePublish = false
        this.ngxTranslate.get("errors.errorPosting").subscribe(res=>{
          this.errorMessage = res
        })
      }
    })
  }

  redirect(){
    this.rotuer.navigate(["map"])
  }

  openMapFunc(){
    this.openMap = true
  }

  closeMap(){
    this.openMap = false
    this.lat = "Lat : " + this.marker?.getLatLng().wrap().lat
    this.lng = "Lng : " + this.marker?.getLatLng().wrap().lng
    this.fullcoord = this.marker?.getLatLng().lat + "," + this.marker?.getLatLng().lng

  }

  ngOnDestroy(){
    this.map?.off()
    this.map?.remove()
  }

}
