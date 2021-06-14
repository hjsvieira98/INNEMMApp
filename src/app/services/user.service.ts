import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  getUserInfo(auth_token) {
   let body = {}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"getUserInfo", body ,{ headers });
  }
}
