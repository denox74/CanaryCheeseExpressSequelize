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

  getById(id: any){
    return this.httpClient.get(`${this.endpoint}/${id}`);
  }

  create(cheese:any, blob:any){
    // If there's a blob (photo), send multipart/form-data with FormData (allows file upload)
    if (blob) {
      const form = new FormData();
      form.append('name', cheese.name);
      form.append('curation', cheese.curation);
      // ensure weight is sent as a string that the server can parse (use dot decimal)
      form.append('weight', String(cheese.weight));
      form.append('origen', cheese.origen);
      // file field expected by multer is 'file'
      form.append('file', blob, 'photo.jpg');
      return this.httpClient.post(this.endpoint, form);
    }

    // Otherwise send JSON; ensure weight is a number (try to parse)
    const payload: any = {
      name: cheese.name,
      curation: cheese.curation,
      weight: (typeof cheese.weight === 'string') ? parseFloat(cheese.weight.replace(',', '.')) : cheese.weight,
      origen: cheese.origen,
      // filename can be provided if you already have an URL/name
      filename: cheese.filename || ''
    };

    return this.httpClient.post(this.endpoint, payload, { headers: { 'Content-Type': 'application/json' } });
  }

    delete(id: any){
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
    update(id: any, cheese: any, blob: any = null) {
    if (blob) {
      const form = new FormData();
      form.append('name', cheese.name);
      form.append('curation', cheese.curation);
      form.append('weight', String(cheese.weight));
      form.append('origen', cheese.origen);
      form.append('file', blob, 'photo.jpg');
      return this.httpClient.put(`${this.endpoint}/${id}`, form);
    }
    return this.httpClient.put(`${this.endpoint}/${id}`, cheese);
  }
 
  
}
