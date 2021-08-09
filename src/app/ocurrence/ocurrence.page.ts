import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../environments/environment";
import {OccurrenceService} from "../services/occurrence.service";
import {Tab1Page} from "../tab1/tab1.page";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation/ngx";
import Swal from "sweetalert2";
import {OcurrencesService} from "../services/ocurrences.service";
import {ModalOccurrenceAcceptedPageComponent} from "../modal-occurrence-accepted-page/modal-occurrence-accepted-page.component";
import {ModalController} from "@ionic/angular";


@Component({
  selector: 'app-ocurrence',
  templateUrl: './ocurrence.page.html',
  styleUrls: ['./ocurrence.page.scss'],
})
export class OcurrencePage implements OnInit {
  ocurrence : any;
  style = 'mapbox://styles/mapbox/streets-v11';
  showCancelButton : boolean = false;
  coords: []
  arrivedTime:any;
  @ViewChild('map') map: ElementRef;

  constructor(private route: ActivatedRoute,
              private router:Router,
              private _occurenceservice:OccurrenceService,
              private _tab1Component:Tab1Page,
              private backgroundGeolocation: BackgroundGeolocation,
              private _ocurrencesservice:OcurrencesService,
              public modalController: ModalController
) { }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      let navParams = this.router.getCurrentNavigation().extras.state;
      this.ocurrence = navParams;
      let occurenceOppned = JSON.parse(localStorage.getItem('occurrence'));
      if(occurenceOppned != null && occurenceOppned.id == this.ocurrence.id){
        this.showCancelButton = true
      }else{
        this.showCancelButton = false;
      }
      this._occurenceservice.occurrenceOpened(localStorage.getItem('token'),this.ocurrence.id).subscribe(res=>
      {

        this.coords = this.ocurrence.userlocations.map(function(num) {
          return [num.long,num.lat]
        })
        this.formatMap(this.coords)
        var diff = Math.abs(Date.parse(this.ocurrence.userlocations[0].created_at) -
          Date.parse(this.ocurrence.userlocations[this.ocurrence.userlocations.length -1].created_at ));

        console.log(diff)
        this.arrivedTime = this.timeConvert(Math.floor((diff/1000)/60));


        // @ts-ignore
        // this._ocurrencesservice.getDistanceTime(this.coords[0],
        //   this.coords[this.coords.length -1]  ).subscribe(res => {
        //     this.arrivedTime = Math.floor(res["routes"][0].duration % 3600 / 60);
        // })
      })

    });

  }

 async formatMap(coords){
  console.log(coords)
   var map = new mapboxgl.Map({
     accessToken: environment.mapbox.accessToken,
    container: this.map.nativeElement,
     style: this.style,
     center: coords[0] ? coords[0] : [this.ocurrence.longitude,this.ocurrence.latitude],
     zoom: 12,

   });
    if(coords.length > 0){
      map.on('load', function () {
        map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': coords
            }
          }
        });
        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#888',
            'line-width': 3
          }
        });
      });

    }else{
      new mapboxgl.Marker()
        .setLngLat([this.ocurrence.longitude, this.ocurrence.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML("<img width='20px' src=''><br><h6>Bombeiro </h6>")).addTo(map)

    }

  }
  getOccurrences(){
    this._tab1Component.refreshOccurrences();
  }
  cancelOccurrence(){
    Swal.fire({
      title: 'Atenção',
      text: "Tem a certeza que deseja canclear esta ocurrencia?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._ocurrencesservice.rejectOccurrence(localStorage.getItem('token'),this.ocurrence).subscribe(res=>{
          localStorage.setItem('occurrence',null);
          this.backgroundGeolocation.stop();
          this.backgroundGeolocation.finish();
          Swal.fire(
            'Ocorrencia encerrada com sucesso',
            '',
            'success'
          )
        })

      }
    })

  }
  acceptOccurrence(){
    this.presentModal(this.ocurrence)

  }
  async presentModal(occurrence) {
    const modal = await this.modalController.create({
      component: ModalOccurrenceAcceptedPageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'occurrence': occurrence,
      }
    });
    return await modal.present();
  }

  timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " h(s)" + rminutes + " m(s)";
  }

}
