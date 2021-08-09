import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  countAcceptedOccurrences(auth_token) {
    let body = {}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"countAcceptedOccurrences", body ,{ headers });
  }
  countRefusedOccurrences(auth_token) {
    let body = {}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"countRefusedOccurrences", body ,{ headers });
  }
  occurrencesAcceptedByMonth(auth_token) {
    let body = {}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"occurrencesAcceptedByMonth", body ,{ headers });
  }
  getAverageArriveTime(auth_token) {
    let body = {}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"getAverageArriveTime", body ,{ headers });
  }
}
