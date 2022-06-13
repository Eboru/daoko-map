import { LocationsService } from './../../Services/locations.service';
import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: any;

  constructor(private location: LocationsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
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

    this.location.getLocations().subscribe((res) => {
      if (res.InternalCode != 'I_Success') {
        //Set modal
        return;
      }

      if (res.Payload.locations == undefined) {
        return;
      }
      res.Payload.locations.forEach(e=>{
        var locations : string[] = e.location.split(",")
        var lat = Number(locations[0])
        var lng = Number(locations[1])
        if(lat == NaN || lng == NaN){
          return
        }
        if(-90<=lat && lat<=90){
          return
        }
        if(-180<=lng && lng<=180){
          return
        }
        var marker = new L.Marker([lat, lng]).addTo(this.map);
        marker.on('click', (event)=>{
          this.location.getDetail(e.id).subscribe(res=>{
            if (res.InternalCode != 'I_Success') {
              //Set modal
              return;
            }
            res.Payload.date =  res.Payload.date  + " UTC"
            var date = new Date(res.Payload.date)
            marker.bindPopup(`
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
            <small style="font-size: 9px;">Reviewed by ${res.Payload.reviewer}</small>
            </p>

            `);
          })
        })
      }
      )

    });
  }

  ngOnDestroy(){
    this.map?.off()
    this.map?.remove()
  }
}
