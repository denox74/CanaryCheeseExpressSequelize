import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheeseService {

  // Endpoint del backend de quesos
  endpoint = 'http://localhost:8080/api/cheeses';

  // Dirección del servidor de autenticación (por si la necesitas después)
  AUTH_SERVER_ADDRESS: string = 'http://localhost:4000';

  constructor(private httpClient: HttpClient) {}

  // Construye las opciones HTTP con cabecera Bearer si hay token
  private getOptions(token: string) {
    const bearerAccess = 'Bearer ' + token;

    const options = {
      headers: {
        'Authorization': bearerAccess,
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
      // , withCredentials: true
    };

    return options;
  }

  // Obtiene todos los quesos; si se pasa token, los pide con Authorization
  getCheeses(token?: string) {
    if (token) {
      return this.httpClient.get(this.endpoint, this.getOptions(token));
    }
    return this.httpClient.get(this.endpoint);
  }

  // Obtiene un queso por id; si se pasa token, se envía en la cabecera
  getById(id: any, token?: string) {
    if (token) {
      return this.httpClient.get(
        `${this.endpoint}/${id}`,
        this.getOptions(token)
      );
    }
    return this.httpClient.get(`${this.endpoint}/${id}`);
  }

  // Crea un nuevo queso (con o sin imagen), opcionalmente con token
  create(cheese: any, blob: any, token?: string) {
    // Si hay imagen → multipart/form-data
    if (blob) {
      const form = new FormData();
      form.append('name', cheese.name);
      form.append('curation', cheese.curation);
      form.append('weight', String(cheese.weight));
      form.append('origen', cheese.origen);
      form.append('file', blob, 'photo.jpg');

      if (token) {
        return this.httpClient.post(this.endpoint, form, this.getOptions(token));
      }
      return this.httpClient.post(this.endpoint, form);
    }

    // Si no hay imagen → JSON normal
    const payload: any = {
      name: cheese.name,
      curation: cheese.curation,
      weight: (typeof cheese.weight === 'string')
        ? parseFloat(cheese.weight.replace(',', '.'))
        : cheese.weight,
      origen: cheese.origen,
      filename: cheese.filename || ''
    };

    if (token) {
      return this.httpClient.post(
        this.endpoint,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }
      );
    }

    return this.httpClient.post(
      this.endpoint,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Elimina un queso por id, opcionalmente enviando token
  delete(id: any, token?: string) {
    if (token) {
      return this.httpClient.delete(
        `${this.endpoint}/${id}`,
        this.getOptions(token)
      );
    }
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }

  // Actualiza un queso (con o sin nueva imagen), opcionalmente con token
  update(id: any, cheese: any, blob: any = null, token?: string) {
    if (blob) {
      const form = new FormData();
      form.append('name', cheese.name);
      form.append('curation', cheese.curation);
      form.append('weight', String(cheese.weight));
      form.append('origen', cheese.origen);
      form.append('file', blob, 'photo.jpg');

      if (token) {
        return this.httpClient.put(
          `${this.endpoint}/${id}`,
          form,
          this.getOptions(token)
        );
      }
      return this.httpClient.put(`${this.endpoint}/${id}`, form);
    }

    if (token) {
      return this.httpClient.put(
        `${this.endpoint}/${id}`,
        cheese,
        this.getOptions(token)
      );
    }

    return this.httpClient.put(`${this.endpoint}/${id}`, cheese);
  }
}
