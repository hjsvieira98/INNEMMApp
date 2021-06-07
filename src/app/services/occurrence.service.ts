import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OccurrenceService {

  constructor(private http: HttpClient) { }

  occurrenceOpened(auth_token,occurrenceID) {

    let body = {occurrence_id: occurrenceID}
    let headers = new HttpHeaders();
    const authroizationToken = 'Bearer '.concat(auth_token);
    headers = headers.append('Authorization', authroizationToken);
    return this.http.post(environment.baseURL +"occurrenceOpened", body ,{ headers });
  }
}
