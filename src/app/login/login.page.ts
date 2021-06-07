import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserModel} from '../Models/User/user-model';
import {LoginServiceService} from "../services/login-service.service";
import {Router} from "@angular/router";
import {Geolocation} from "@ionic-native/geolocation/ngx";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  LoginForm: FormGroup;
  User: UserModel = new UserModel();
  constructor(private _formBuilder: FormBuilder,
              private _loginService:LoginServiceService,
              private router: Router,
              private geolocation: Geolocation,) {  }

  ngOnInit() {
    this.LoginForm = this.createLoginForm();
  }
  createLoginForm(): FormGroup {
    return this._formBuilder.group({
      email: [this.User.email, Validators.required],
      password: [this.User.password, Validators.required],

    });
  }
  login() {
    this._loginService.Login(this.LoginForm.getRawValue()).subscribe(res=>{
      console.log(res["status"],res["token"])
      if(res["status"] == "success"){
     localStorage.setItem('token', res["token"]);
      this._loginService.RegistaplayerID(localStorage.getItem("userId"),res["token"]).subscribe(res=>{
        this.geolocation.getCurrentPosition().then((resp) => {
          console.log(resp.coords.latitude,resp.coords.longitude)
          this._loginService.saveLastPosition(resp.coords.latitude,resp.coords.longitude,localStorage.getItem("token"))
            .subscribe(res=> {

            })
        }).catch((error) => {
          console.log('Error getting location', error);
        });
        this.router.navigate(['tabs/tab1']);
        }

      )
      }
    });
  }

  OneSignalConfig(){

  }
}
