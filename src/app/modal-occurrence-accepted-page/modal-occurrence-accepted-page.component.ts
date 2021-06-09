import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {OcurrencesService} from "../services/ocurrences.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import Swal from 'sweetalert2'
import {BackgroundGeolocation} from "@ionic-native/background-geolocation/ngx";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';

@Component({
  selector: 'app-modal-occurrence-accepted-page',
  templateUrl: './modal-occurrence-accepted-page.component.html',
  styleUrls: ['./modal-occurrence-accepted-page.component.scss'],
})
export class ModalOccurrenceAcceptedPageComponent implements OnInit {
  @Input() occurrence: any;
  time:any;

  constructor(public modalController: ModalController,
              private _occurrenceService: OcurrencesService,
              private geolocation: Geolocation,
              private backgroundGeolocation: BackgroundGeolocation) {
  }

  ngOnInit() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const origin = resp.coords.longitude + "," + resp.coords.latitude;
      console.log(origin);
      const destination = this.occurrence.longitude + "," + this.occurrence.latitude;
      console.log(destination);
      this._occurrenceService.getDistanceTime(origin, destination).subscribe(res => {
        console.log(res);
        this.time = Math.floor(res["routes"][0].duration % 3600 / 60);
      })
    });

  }
  closeModal() {
    this.modalController.dismiss();
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

 confirmaOcorrencia(){
   Swal.fire({
     title: 'Tem a certeza?',
     text: "ao aceitar esta ocorrencia tem o dever civico de comparecer",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Confirmar'
   }).then((result) => {
     if (result.isConfirmed) {
       this._occurrenceService.acceptOccurrence(localStorage.getItem('token'),this.occurrence.id).subscribe(res=>{
         this.backgroundGeolocation.start();
         Swal.fire(
           'Ocorrencia aceite com sucesso',
           '',
           'success'
         )
       })

     }
   })

 }

}
