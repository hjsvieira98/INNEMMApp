import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {OcurrencesService} from "../services/ocurrences.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import Swal from 'sweetalert2'
import {BackgroundGeolocation} from "@ionic-native/background-geolocation/ngx";
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import {Tab1Page} from "../tab1/tab1.page";

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
              private backgroundGeolocation: BackgroundGeolocation,
              private tab1Page:Tab1Page) {
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
   const Toast = Swal.mixin({
     toast: true,
     position: 'top-end',
     showConfirmButton: false,
     timer: 3000,
     timerProgressBar: true,
     didOpen: (toast) => {
       toast.addEventListener('mouseenter', Swal.stopTimer)
       toast.addEventListener('mouseleave', Swal.resumeTimer)
     }
   })
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
       this._occurrenceService.acceptOccurrence(localStorage.getItem('token'),this.occurrence).subscribe(res=>{
         this.backgroundGeolocation.start();
         this.tab1Page.getOccurrences().subscribe(res=>{
           console.log(res);
           this.tab1Page.ocurrences = res
             this.tab1Page.ocurrences = this.tab1Page.ocurrences.filter(m=> m.pivot.status == this.tab1Page.selectedTab)
              console.log(this.tab1Page.ocurrences);
             this.modalController.dismiss({
               'dismissed': true
             });
             Toast.fire({
               icon: 'success',
               title: 'Ocorrencia aceite com sucesso'
             })
         }
         )


      this.tab1Page.refreshOccurrences();
       })

     }
   })

 }

}
