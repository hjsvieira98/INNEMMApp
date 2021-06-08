import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation/ngx";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private router:Router,
              private backgroundGeolocation: BackgroundGeolocation,
  ) {}

  logout(){
    localStorage.setItem("token","");
    this.router.navigate(['/']);
  }
  ParaFDP(){
    this.backgroundGeolocation.finish();
    this.backgroundGeolocation.stop();
  }
}
