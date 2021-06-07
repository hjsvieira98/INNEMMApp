import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http: HttpClient) { }
  Login(body) {

    return this.http.post(environment.baseURL +"login",body);
  }
  RegistaplayerID(playerID,auth_token) {
    console.log(playerID)
    let body = {"playerID":playerID}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    console.log(headers);
    return this.http.post(environment.baseURL +"attachPlayerIDtoLoggedUser", body ,{ headers });
  }

  saveLastPosition(lat,long,auth_token) {
    let body = {"latitude":lat,"longitude":long}
    let headers = new HttpHeaders();
    console.log(auth_token)
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    console.log(headers);
    return this.http.post(environment.baseURL +"saveLastPosition", body ,{ headers });
  }
}

