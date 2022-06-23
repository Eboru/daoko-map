import { GoogleTranslateService }  from './../../Services/translate.service';
import { TranslateService } from '@ngx-translate/core';
import { MetaLocation } from './../../structs/MetaLocation';
import { LocationsService } from './../../Services/locations.service';
import { AfterViewInit, Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-providers';
import { forkJoin } from 'rxjs';

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

  constructor(private location: LocationsService, private translate : GoogleTranslateService, private ngxTranslate : TranslateService) {}

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
      minZoom: 2,
      maxZoom: 16,
      worldCopyJump: true
    });
    L.tileLayer.provider('Stamen.Watercolor', {minZoom : 2, maxZoom: 16, noWrap: false}).addTo(this.map);
    L.tileLayer.provider('Stamen.TerrainLabels', {minZoom : 2, maxZoom: 16, noWrap: false}).addTo(this.map);
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
          this.ngxTranslate.get("errors.serverDown").subscribe(res=>{
            this.errorMsg = res
          })
          this.popError = true
          return;
        }

        if (res.Payload.locations == undefined) {
          this.ngxTranslate.get("errors.serverDown").subscribe(res=>{
            this.errorMsg = res
          })
          this.popError = true
          return;
        }

        this.markers = L.markerClusterGroup()
        res.Payload.locations.forEach(e=>this.foreachMeta(e, 0))
        res.Payload.locations.forEach(e=>this.foreachMeta(e, -360))
        res.Payload.locations.forEach(e=>this.foreachMeta(e, 360))
        this.map?.addLayer(this.markers)

      },
      error: (err) =>{
        this.ngxTranslate.get("errors.serverDown").subscribe(res=>{
          this.errorMsg = res
        })
        this.popError = true
      }
    });
  }

  ngOnDestroy() {
    this.map?.off();
    this.map?.remove();
  }


  foreachMeta( e: MetaLocation, offsetX : number){
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
    lng+=offsetX
    var marker = new L.Marker([lat, lng]);
    marker.on('click', (event) => {
      forkJoin([this.location.getDetail(e.id), this.ngxTranslate.get("marker.writes"), this.ngxTranslate.get("marker.date"), this.ngxTranslate.get("marker.reviewer"), this.ngxTranslate.get("marker.translate"), this.ngxTranslate.get("errors.translationUnavailable")]).subscribe(res=>{
        const detail = res[0].Payload
        const writes = res[1]
        const dateStr = res[2]
        const reviewer = res[3]
        const translate = res[4]
        const translationError = res[5]
        if (res[0].InternalCode != 'I_Success') {
          //Set modal
          return;
        }
        detail.date = detail.date + ' UTC';
        var date = new Date(detail.date);
        var popup = marker.bindPopup(`
          <p>
          <div>
          ${detail.publisher} ${writes} :
          </div>
          <div>
          ${detail.message}
          </div>
          <div>
          ${dateStr} ${date.toLocaleDateString()}
          </div>
          <small style="font-size: 9px;">${reviewer} ${
            detail.reviewer
          }</small>
          <div>
          <a id="translate">${translate}</a>
          </div>
          </p>
          `)
        popup.addEventListener("popupopen", (e)=>{
          (e.popup as any)._closeButton.href="map#close"
        })
        popup.openPopup()
        let link = L.DomUtil.get('translate');
        L.DomEvent.addListener(link!, 'click', (e) => {
          this.translate.translate(detail.message).subscribe({
            next : (res2)=>{
              popup.setPopupContent(`
              <p>
              <div>
              ${detail.publisher} ${writes} :
              </div>
              <div>
              ${res2.data.translations[0].translatedText} from ${res2.data.translations[0].detectedSourceLanguage}
              </div>
              <div>
              ${dateStr} ${date.toLocaleDateString()}
              </div>
              <small style="font-size: 9px;">${reviewer} ${
                detail.reviewer
              }</small>
              <div>
              </div>
              </p>
              `)
            },
            error : (err2)=>{
              popup.setPopupContent(`
              <p>
              <div>
              ${detail.publisher} ${writes} :
              </div>
              <div>
              ${detail.message}
              </div>
              <div>
              ${dateStr} ${date.toLocaleDateString()}
              </div>
              <small style="font-size: 9px;">Reviewed by ${
                detail.reviewer
              }</small>
              <div>
              <div>
              <small>${translationError}</small>
              </div>
              <a id="translate">${translate}</a>
              </div>
              </p>
              `)
            }
          })
      })
      });
    });
    this.markers?.addLayer(marker)
  }
}
