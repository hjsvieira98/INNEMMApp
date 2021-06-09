import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OcurrencesService {

  constructor(private http: HttpClient) { }
  getOcurrences(auth_token) {

    let body = {}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"getOccurrences", body ,{ headers });
  }

  acceptOccurrence(auth_token,occurrenceID) {

    localStorage.setItem('occurrence_id', occurrenceID);

    let body = {occurrence_id: occurrenceID}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"acceptOccurrence", body ,{ headers });
  }
  rejectOccurrence(auth_token,occurrenceID) {

    let body = {occurrence_id: occurrenceID}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"rejectOccurrence", body ,{ headers });
  }
  updateUserLatLong(auth_token,occurrenceID,lat,long) {

    let body = {occurrence_id: occurrenceID,latitude:lat,longitude:long}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"updateOccurrenceUserLocation", body ,{ headers });
  }

  getDistanceTime(origin,destination){
    return this.http.get(" https://api.mapbox.com/directions/v5/mapbox/driving/"+origin+";" +destination+"?geometries=geojson&access_token=pk.eyJ1IjoicmFmYWVscGVyZWlyYTk3IiwiYSI6ImNrb2l1OWRoMTBvb3gyeHJtMjc5bHQzcjMifQ.a9JVwy1esI237WyBi2uQUQ")
  }
}
