import { Component } from '@angular/core';
import {Router,NavigationExtras} from "@angular/router";
import {OcurrencesService} from "../services/ocurrences.service";
import {Ocurrences} from "../Models/Ocurrences/ocurrences";
import {ModalController} from "@ionic/angular";
import {ModalOccurrenceAcceptedPageComponent} from "../modal-occurrence-accepted-page/modal-occurrence-accepted-page.component";
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  ocurrences: any;
  selectedTab:any = '0';
  color:string = "#ffffff"
  occurrence:any;
  constructor(private router: Router,
              private _ocurrencesservice:OcurrencesService,
              public modalController: ModalController) {
  }
  doRefresh(event) {
    this.ocurrences = null
    this.getOccurrences().subscribe(res=>{

      setTimeout(()=>{  this.ocurrences = res
        this.ocurrences = this.ocurrences.filter(m=> m.pivot.status == this.selectedTab);
        this.occurrence = JSON.parse(localStorage.getItem('occurrence'))}, 1000)
      event.target.complete();
    })



  }

  getOccurrences(){
   return  this._ocurrencesservice.getOcurrences(localStorage.getItem('token'))
  }

  refreshOccurrences(){
    this.getOccurrences().subscribe(res=>{

      setTimeout(()=>{ this.ocurrences = res
        this.ocurrences = this.ocurrences.filter(m=> m.pivot.status == this.selectedTab); }, 1000)

    })
  }

  ionViewWillEnter(){
    this.getOccurrences().subscribe(res=>{
      console.log(res);
      setTimeout(()=>{ this.ocurrences = res
        this.ocurrences = this.ocurrences.filter(m=> m.pivot.status == this.selectedTab) }, 1000)
    })
    this.occurrence = JSON.parse(localStorage.getItem('occurrence'))
    console.log(this.occurrence);
  }
  viewOccurrence(ocurrence:any){

    let navigationExtras: NavigationExtras = { state: ocurrence  };
    this.router.navigate(['ocurrence'],navigationExtras);
  }

  acceptOccurrence(occurrence){
      this.presentModal(occurrence)
  }

  rejectOccurrence(occurrence){
    this._ocurrencesservice.rejectOccurrence(localStorage.getItem('token'),occurrence.id).subscribe(res=>{
      let index = this.ocurrences.findIndex(d => d.id === occurrence.id); //find index in your array
      this.ocurrences.splice(index, 1);
    })
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
  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    this.selectedTab = ev.detail.value;
    this.getOccurrences().subscribe(res=>{
      this.ocurrences = res
      this.ocurrences = this.ocurrences.filter(m=> m.pivot.status == ev.detail.value);

    })
  }


}
