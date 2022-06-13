import { MetaLocation } from './../../structs/MetaLocation';
import { LocationsService } from './../../Services/locations.service';
import { AfterViewInit, Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  private map: L.Map | undefined = undefined;
  markers : L.MarkerClusterGroup | undefined
  errorMsg: string = '';
  popError: boolean = false;

  constructor(private location: LocationsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngAfterViewChecked(): void {
      this.map?.invalidateSize(true)
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [0, 0],
      zoom: 2,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 1,
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
    this.location.getLocations().subscribe({
      next: (res) => {
        if (res.InternalCode != 'I_Success') {
          this.errorMsg = "This should have not happen, we are sorry :/"
          this.popError = true
          return;
        }

        if (res.Payload.locations == undefined) {
          this.errorMsg = "This should have not happen, we are sorry :/"
          this.popError = true
          return;
        }
        this.markers = L.markerClusterGroup()
        res.Payload.locations.forEach(e=>this.foreachMeta(e))
        this.map?.addLayer(this.markers);

      },
      error: (err) =>{
        this.errorMsg = "This should have not happen, we are sorry :/"
        this.popError = true
      }
    });
  }

  ngOnDestroy() {
    this.map?.off();
    this.map?.remove();
  }


  foreachMeta( e: MetaLocation){
    var locations: string[] = e.location.split(',');
    var lat = Number(locations[0]);
    var lng = Number(locations[1]);
    if (lat == NaN || lng == NaN) {
      return;
    }
    if (!(-90 <= lat && lat <= 90)) {
      return;
    }
    if (!(-180 <= lng && lng <= 180)) {
      return;
    }
    var marker = new L.Marker([lat, lng]);
    marker.on('click', (event) => {
      this.location.getDetail(e.id).subscribe((res) => {
        if (res.InternalCode != 'I_Success') {
          //Set modal
          return;
        }
        res.Payload.date = res.Payload.date + ' UTC';
        var date = new Date(res.Payload.date);
        var popup = marker.bindPopup(`
          <p>
          <div>
          ${res.Payload.publisher} writes :
          </div>
          <div>
          ${res.Payload.message}
          </div>
          <div>
          Date ${date.toLocaleDateString()}
          </div>
          <small style="font-size: 9px;">Reviewed by ${
            res.Payload.reviewer
          }</small>
          </p>
          `)
        popup.addEventListener("popupopen", (e)=>{
          (e.popup as any)._closeButton.href="map#close"
        })
        popup.openPopup()
      });
    });
    this.markers?.addLayer(marker)
  }
}
