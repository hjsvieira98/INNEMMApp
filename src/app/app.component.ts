import { Component } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import {environment} from "../environments/environment";
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {LoginServiceService} from "./services/login-service.service";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationEvents,
  BackgroundGeolocationLocationProvider,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import {OcurrencesService} from "./services/ocurrences.service";


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private oneSignal: OneSignal, platform: Platform,
              private router: Router,
              private geolocation: Geolocation,
              private _loginService: LoginServiceService,
              private backgroundGeolocation: BackgroundGeolocation,
              private occurenceServices: OcurrencesService,) {

    if (localStorage.getItem('occurrence')) {
      this.backgroundGeolocation.start();
    }
    const config: BackgroundGeolocationConfig = {
      locationProvider: BackgroundGeolocationLocationProvider.DISTANCE_FILTER_PROVIDER,
      desiredAccuracy: localStorage.getItem('desiredAccuracy') ? +localStorage.getItem('desiredAccuracy')  : 10,
      stationaryRadius: localStorage.getItem('stationaryRadius') ? +localStorage.getItem('stationaryRadius')  : 20,
      distanceFilter: localStorage.getItem('distanceFilter') ? +localStorage.getItem('distanceFilter')  : 0.1,
      interval: 3000,
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true, // enable this to clear background location settings when the app terminates
    };
    this.backgroundGeolocation.configure(config)
      .then(() => {

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
          var Occurence = JSON.parse(localStorage.getItem('occurrence'))
          this.occurenceServices.updateUserLatLong(localStorage.getItem("token"), Occurence.id
            , location.latitude, location.longitude).subscribe(res => {
            if (res["inRange"]) {
              this.backgroundGeolocation.stop();
              localStorage.setItem('occurrence', '');
            }

            if (platform.is('ios')) {
              console.log('ios')
              this.backgroundGeolocation.finish();
            }

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
      if (token != "" && token != null) {
        this.geolocation.getCurrentPosition().then((resp) => {
          this._loginService.saveLastPosition(resp.coords.latitude, resp.coords.longitude, token).subscribe(res => {
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

