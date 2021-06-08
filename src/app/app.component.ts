import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx'
import {environment} from "../environments/environment";
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {LoginServiceService} from "./services/login-service.service";
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import {OcurrencesService} from "./services/ocurrences.service";
import {OcurrencePage} from "./ocurrence/ocurrence.page";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private oneSignal: OneSignal,platform: Platform,
              private router: Router,
              private geolocation: Geolocation,
              private _loginService:LoginServiceService,
              private backgroundGeolocation: BackgroundGeolocation,
              private occurenceServices:OcurrencesService,
              private ocurrencePage:OcurrencePage


            ) {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 1 ,
      stationaryRadius: 1,
      distanceFilter: 1 ,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true, // enable this to clear background location settings when the app terminates
    };
    this.backgroundGeolocation.configure(config)
      .then(() => {

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
        console.log("asdasdasdasd")
          this.occurenceServices.updateUserLatLong(localStorage.getItem("token"),2205
            ,location.latitude,location.longitude).subscribe(res=> {
              console.log(res["debug"])
            if(res["inRange"]){
              this.backgroundGeolocation.stop();
            }
            this.backgroundGeolocation.finish();
          })
        });
      });
      if (platform.is('cordova')) {

        if (platform.is('android')) {
          this.oneSignal.startInit(environment.onseSignalAppId, environment.googleProjectId);
        }
        if (platform.is('ios')) {
          this.oneSignal.startInit(environment.onseSignalAppId);
        }
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        this.oneSignal.handleNotificationReceived().subscribe(() => {
          // do something when notification is received
        });
        this.oneSignal.handleNotificationOpened().subscribe(result => {
          // do something when a notification is opened
        });

        this.oneSignal.endInit();

        // Then You Can Get Devices ID

        this.oneSignal.getIds().then(identity => {
          localStorage.setItem('pushToken', identity.pushToken);
          localStorage.setItem('userId', identity.userId);
        });

        let token = localStorage.getItem("token");
        if(token != "" && token != null) {
          this.geolocation.getCurrentPosition().then((resp) => {
            this._loginService.saveLastPosition(resp.coords.latitude,resp.coords.longitude,token).subscribe(res=>{
              this.router.navigate(['tabs/tab1']);
            })
          }).catch((error) => {
            console.log('Error getting location', error);
          });

          let watch = this.geolocation.watchPosition();
          watch.subscribe((data) => {
          });
        }
      }

  }
}
