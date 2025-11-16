import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { AuthResponse } from './auth-response';
import { Observable, tap } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
// Servicio de autenticación para registro, login y gestión del token
export class AuthService {

  // Indica si el almacenamiento de Ionic está inicializado
  initializedStorage: boolean = false;

  // URL base del servidor backend
  AUTH_SERVER_ADDRESS: string = 'http://localhost:4000';

  constructor(private httpClient: HttpClient, private storage: Storage) {
    this.initializeStorage();
  }

  // Inicializa el almacenamiento persistente de Ionic
  async initializeStorage() {
    if (!this.initializedStorage) await this.storage.create();
    this.initializedStorage = true;
  }

  // Devuelve si el storage ya está listo para usarse
  isInitializedStorage() {
    return this.initializedStorage;
  }

  // Construye la cabecera Authorization con Basic usuario:password en base64
  private getOptions(user: User) {
    let base64UserAndPassword = window.btoa(user.username + ":" + user.password);
    let basicAccess = 'Basic ' + base64UserAndPassword;

    let options = {
      headers: {
        'Authorization': basicAccess,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      // , withCredentials: true
    };

    return options;
  }

  // Registro de usuario (envía credenciales en cabecera Basic)
  register(user: User): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(
        `${this.AUTH_SERVER_ADDRESS}/api/users/`,
        user,
        this.getOptions(user)
      )
      .pipe(
        tap(async (res: AuthResponse) => {
          if (res.user) {
            await this.storage.set("token", res.access_token);
          }
        })
      );
  }

  // Login de usuario (usa Basic y guarda el token devuelto)
  login(user: User): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(
        `${this.AUTH_SERVER_ADDRESS}/api/users/signin`,
        null,
        this.getOptions(user)
      )
      .pipe(
        tap(async (res: AuthResponse) => {
          if (res.user) {
            await this.storage.set("token", res.access_token);
          }
        })
      );
  }

  // Elimina el token guardado (cierra sesión)
  async logout() {
    await this.storage.remove("token");
  }

  // Comprueba si hay un token almacenado (usuario logueado)
  async isLoggedIn() {
    let token = await this.storage.get("token");
    if (token) { // solo comprueba existencia; no valida caducidad
      return true;
    }
    return false;
  }
}