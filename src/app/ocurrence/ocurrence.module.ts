import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OcurrencePageRoutingModule } from './ocurrence-routing.module';

import { OcurrencePage } from './ocurrence.page';
import {GoogleMapsModule} from "@angular/google-maps";
import {Tab1Page} from "../tab1/tab1.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OcurrencePageRoutingModule,
    GoogleMapsModule
  ],
  declarations: [OcurrencePage],
  providers:[Tab1Page]
})
export class OcurrencePageModule {}
