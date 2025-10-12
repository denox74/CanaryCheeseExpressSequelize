import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CheeseService {

  endpoint = 'http://localhost:8080/api/cheeses';

  constructor (private httpClient: HttpClient) {}

  getCheeses(){
    return this.httpClient.get(this.endpoint);
  }

  create(cheese: any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.append("name", cheese.name);
    body.append("curation",cheese.curation);

    return this.httpClient.post(this.endpoint, body.toString(), { headers });
  }

    delete(id: any){
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
    update(id: any, cheese: any) {
  return this.httpClient.put(`${this.endpoint}/${id}`, cheese);
}

  
}
