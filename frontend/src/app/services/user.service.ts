import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// Servicio para gestionar peticiones relacionadas con usuarios
export class UserService {

  // URL base del servidor backend de autenticación/usuarios
  AUTH_SERVER_ADDRESS: string = 'http://localhost:4000';

  // Inyecta HttpClient (y Storage si lo necesitas más adelante)
  constructor(private httpClient: HttpClient, private storage: Storage) { }

  // Construye las opciones HTTP con cabecera Bearer para enviar el token
  private getOptions(token: string) {

    let bearerAccess = 'Bearer ' + token;

    let options = {
      headers: {
        'Authorization': bearerAccess,
        // 'Content-Type' : 'application/x-www-form-urlencoded',
      }
      // , withCredentials: true
    };

    return options;
  }

  // Obtiene la lista de usuarios usando un token JWT
  getUsers(token: string) {
    let myOptions = this.getOptions(token);
    console.log(myOptions);
    return this.httpClient.get(`${this.AUTH_SERVER_ADDRESS}/api/users`, myOptions);
  }
}