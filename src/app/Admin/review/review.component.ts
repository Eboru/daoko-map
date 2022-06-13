import { QueuedElement } from './../../structs/Review';
import { ReviewService } from './../../Services/review.service';
import { Component, OnInit, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
import * as L from 'leaflet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationsService } from 'src/app/Services/locations.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})


export class ReviewComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  private map: L.Map | undefined = undefined;
  private marker: L.Marker | undefined = undefined
  openMap : boolean = false

  queue : QueuedElement[] | undefined = undefined
  datosListos : boolean = false
  showError : boolean = false
  errorMsg : string = ""
  popError : boolean = false

  constructor(private review : ReviewService, private rotuer: Router) {

   }

  ngOnInit(): void {
    this.review.getTasks().subscribe(res=>{
      if(res.InternalCode != "I_Success"){
        this.showError = true
        this.errorMsg = "Fatal error"
        return
      }
      if(res.Payload.queue == undefined){
        this.showError = true
        this.errorMsg = "Nothing left!"
        this.queue = undefined
        return
      }
      this.queue = res.Payload.queue
      this.datosListos = true
    })
  }

  ngAfterViewInit(): void {
    this.initMap()
  }

  ngAfterViewChecked(): void {
    this.map?.invalidateSize(true)
  }

  private initMap(): void {
    this.map = L.map('map3', {
      center: [0, 0],
      zoom: 3,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
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
   }

   viewLocation(index : number){
    var split = this.queue![index].location.split(",")
    var lat = Number(split[0])
    var lng = Number(split[1])
    console.log(lat == NaN)
    if(Number.isNaN(lat) || Number.isNaN(lng)){
      this.popError = true
      this.errorMsg = "Invalid coordinates (text)"
      return
    }
    if(-90<=lat && lat<=90){
      this.popError = true
      this.errorMsg = "Invalid latitude range " + lat
      return
    }
    if(-180<=lng && lng<=180){
      this.popError = true
      this.errorMsg = "Invalid latitude range " + lat
      return
    }
    this.openMap = true
    this.marker?.setLatLng([lat, lng])
    this.map?.panTo([lat, lng])
  }

  openMapFunc(){
    this.openMap = true
  }

  closeMap(){
    this.openMap = false
  }

  ngOnDestroy(){
    this.map?.off()
    this.map?.remove()
  }

}




/*
export class ReviewComponent implements OnInit, AfterViewInit, OnDestroy{

  private map: L.Map | undefined = undefined;
  private marker: L.Marker | undefined = undefined

  queue : QueuedElement[] | undefined = undefined
  datosListos : boolean = false
  showError : boolean = false
  errorMsg : string = ""
  openMap : boolean = false

  constructor(private review : ReviewService) { }

  ngOnInit(): void {
    this.review.getTasks().subscribe(res=>{
      if(res.InternalCode != "I_Success"){
        this.showError = true
        this.errorMsg = "Fatal error"
        return
      }
      if(res.Payload.queue == undefined){
        this.showError = true
        this.errorMsg = "Nothing left!"
        this.queue = undefined
        return
      }
      this.queue = res.Payload.queue
      this.datosListos = true
    })
  }

  ngAfterViewInit(): void {
      this.initMap()
  }


  private initMap(): void {
    this.map = L.map('map3', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
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
   }

  /*
  viewLocation(index : number){
    this.showMap = true
    var split = this.queue![index].location.split(",")
    console.log(split)
    this.marker?.setLatLng([Number(split[0]), Number(split[1])])
    this.map?.panTo([Number(split[0]), Number(split[1])])
  }

  openMapFunc(){
    this.openMap = true
    this.map?.invalidateSize(true)
    console.log("open")
  }

  closeMap(){
    this.openMap = false
    this.map?.invalidateSize(true)
    console.log("closed")
  }

  ngOnDestroy(){
    this.map?.off()
    this.map?.remove()
  }

}
*/
