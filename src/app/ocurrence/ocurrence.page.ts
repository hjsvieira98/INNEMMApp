import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../environments/environment";
import {OccurrenceService} from "../services/occurrence.service";
import {Tab1Page} from "../tab1/tab1.page";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation/ngx";
import Swal from "sweetalert2";
import {OcurrencesService} from "../services/ocurrences.service";


@Component({
  selector: 'app-ocurrence',
  templateUrl: './ocurrence.page.html',
  styleUrls: ['./ocurrence.page.scss'],
})
export class OcurrencePage implements OnInit {
  ocurrence : any;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  showCancelButton : boolean = false;
  @ViewChild('mapElement') mapElement: ElementRef;

  constructor(private route: ActivatedRoute,
              private router:Router,
              private _occurenceservice:OccurrenceService,
              private _tab1Component:Tab1Page,
              private backgroundGeolocation: BackgroundGeolocation,
              private _ocurrencesservice:OcurrencesService


  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      let navParams = this.router.getCurrentNavigation().extras.state;
      this.ocurrence = navParams;
      let occurenceOppned = JSON.parse(localStorage.getItem('occurrence'));
      console.log(occurenceOppned)
      if(occurenceOppned != null && occurenceOppned.id == this.ocurrence.id){
        this.showCancelButton = true
      }else{
        this.showCancelButton = false;
      }
      this._occurenceservice.occurrenceOpened(localStorage.getItem('token'),this.ocurrence.id).subscribe(res=>
      {

      })

    });
  }

  ngAfterViewInit(){
    this.map = new mapboxgl.Map({
      container: this.mapElement.nativeElement,
      accessToken: environment.mapbox.accessToken,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 13,
      center: [this.ocurrence.longitude, this.ocurrence.latitude],

    });


    let marker1 = new mapboxgl.Marker()
      .setLngLat([this.ocurrence.longitude, this.ocurrence.latitude])
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML("<img width='20px' src=''><br><h6>Bombeiro </h6>")).addTo(this.map)

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

}
