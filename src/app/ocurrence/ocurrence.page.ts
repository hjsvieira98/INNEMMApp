import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import * as mapboxgl from 'mapbox-gl';
import {environment} from "../../environments/environment";
import {OccurrenceService} from "../services/occurrence.service";
import {Tab1Page} from "../tab1/tab1.page";


@Component({
  selector: 'app-ocurrence',
  templateUrl: './ocurrence.page.html',
  styleUrls: ['./ocurrence.page.scss'],
})
export class OcurrencePage implements OnInit {
  ocurrence : any;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  @ViewChild('mapElement') mapElement: ElementRef;

  constructor(private route: ActivatedRoute,
              private router:Router,
              private _occurenceservice:OccurrenceService,
              private _tab1Component:Tab1Page,
              ) { }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      let navParams = this.router.getCurrentNavigation().extras.state;
      this.ocurrence = navParams;
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
    console.log("asdasd")
    this._tab1Component.refreshOccurrences();

  }


}
