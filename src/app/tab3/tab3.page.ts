import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation/ngx";
import {AlertController} from "@ionic/angular";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  user:any;

  constructor(private router:Router,
              public alertCtrl: AlertController,
              private userService:UserService) {}

  ngOnInit(){
    this.userService.getUserInfo(localStorage.getItem('token')).subscribe(res=>{
      this.user = res
    })
  }
  logout(){
    localStorage.clear();
    this.router.navigate(['/']);
  }

  async presentAlertPrompt(title,max,min,placeholder,type) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: title,
      inputs: [
        {
          name: 'name1',
          type: 'number',
          placeholder: placeholder,
          max:max,
          min:min,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            console.log(alertData.name1);
            switch (type){
              case 1:{
                localStorage.setItem('desiredAccuracy',alertData.name1)
                break;
              }
              case 2:{
                localStorage.setItem('stationaryRadius',alertData.name1)
                break;
              }
              case 3:{
                localStorage.setItem('distanceFilter',alertData.name1)
                break;
              }
            }

          }
        }
      ]
    });

    await alert.present();
  }
}
