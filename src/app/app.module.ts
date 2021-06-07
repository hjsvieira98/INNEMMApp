import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GoogleMapsModule } from '@angular/google-maps'
import {BackgroundGeolocation} from "@ionic-native/background-geolocation/ngx";


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,NgbModule, IonicModule.forRoot(), AppRoutingModule, FormsModule,HttpClientModule,GoogleMapsModule],
  providers: [
    OneSignal,
    Geolocation,
    BackgroundGeolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
  bootstrap: [AppComponent],
})
export class AppModule {}
