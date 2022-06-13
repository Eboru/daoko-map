import { QueuedElement, Review } from './../../structs/Review';
import { ReviewService } from './../../Services/review.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  private map: L.Map | undefined = undefined;
  private marker: L.Marker | undefined = undefined;
  openMap: boolean = false;

  queue: QueuedElement[] | undefined = undefined;
  datosListos: boolean = false;
  errorMsg: string = '';
  popError: boolean = false;

  constructor(private review: ReviewService) {}

  ngOnInit(): void {
    this.review.getTasks().subscribe({
      next: (res) => {
        if (res.InternalCode != 'I_Success') {
          return;
        }
        if (res.Payload.queue == undefined) {
          this.popError = true;
          this.errorMsg = 'Nothing left!';
          this.queue = undefined;
          return;
        }
        this.queue = res.Payload.queue;
        this.datosListos = true;
      },
      error: (err) => {
        this.popError = true;
        this.errorMsg = 'Fatal error';
      },
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngAfterViewChecked(): void {
    this.map?.invalidateSize(true);
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
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = iconDefault;
    this.marker = new L.Marker(this.map.getCenter()).addTo(this.map);
  }

  viewLocation(index: number) {
    var split = this.queue![index].location.split(',');
    var lat = Number(split[0]);
    var lng = Number(split[1]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      this.popError = true;
      this.errorMsg = 'Invalid coordinates (text)';
      return;
    }
    if (!(-90 <= lat && lat <= 90)) {
      return;
    }
    if (!(-180 <= lng && lng <= 180)) {
      return;
    }
    this.openMap = true;
    this.marker?.setLatLng([lat, lng]);
    this.map?.panTo([lat, lng]);
  }

  openMapFunc() {
    this.openMap = true;
  }

  closeMap() {
    this.openMap = false;
  }

  ngOnDestroy() {
    this.map?.off();
    this.map?.remove();
  }

  reload(){
    window.location.reload();
  }

  doReview(index : number, yn : boolean){
    let review : Review = new Review
    review.approved = yn
    review.id = this.queue![index].id
    this.review.review(review).subscribe({
      next: (res)=>{
        console.log(res)
        if(res.InternalCode != "I_Success"){
          this.popError = true;
          this.errorMsg = 'Fatal error';
          return
        }
        this.queue![index].reviewd  = true
      },
      error : (err)=>{
        this.popError = true;
        this.errorMsg = 'Fatal error';
      }
    })
  }
}
