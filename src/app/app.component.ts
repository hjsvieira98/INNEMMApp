import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx'
import {environment} from "../environments/environment";
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {LoginServiceService} from "./services/login-service.service";
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';


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
              private backgroundGeolocation: BackgroundGeolocation


            ) {
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 1 ,
      stationaryRadius: 1,
      distanceFilter: 1 ,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    };
    this.backgroundGeolocation.configure(config)
      .then(() => {

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          console.log(location);



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
