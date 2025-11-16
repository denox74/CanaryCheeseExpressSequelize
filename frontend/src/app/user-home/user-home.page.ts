import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
  standalone: false,
})
export class UserHomePage implements OnInit {

  // Texto de ejemplo que ya usabas en la página
  name: string = 'BH';
  curation: string = 'star';

  // Nombre del usuario obtenido del token JWT
  userName: string | null = null;

  constructor(
    private router: Router,
    private storage: Storage,
    private authService: AuthService
  ) {}

  // Al iniciar la página, leemos el token y extraemos el nombre
  async ngOnInit() {
    // Asegura que el storage está inicializado
    await this.storage.create();

    // Recupera el token guardado en el login/register
    const token = await this.storage.get('token');
    console.log('Token en UserHome:', token);

    if (token) {
      try {
        // Decodifica la parte central (payload) del JWT
        const payloadBase64 = token.split('.')[1];
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const payloadJson = atob(base64);
        const payload = JSON.parse(payloadJson);

        console.log('Payload del token:', payload);

        // Intenta usar primero name y si no, username
        this.userName = payload.name || payload.username || null;
      } catch (err) {
        console.error('Error al decodificar el token:', err);
      }
    }
  }

  // Navega a la página de tus quesos
  gotoMyCheeses() {
    this.router.navigateByUrl('/my-cheeses');
  }

  // Navega a la página para añadir un queso
  gotoAddCheeses() {
    this.router.navigateByUrl('/add-cheese');
  }

  // Navega a la home genérica
  gotoHome() {
    this.router.navigateByUrl('/user-home');
  }

  // Navega a la pantalla de login
  gotoLogin() {
    this.router.navigateByUrl('/login');
  }

  // Cierra sesión: borra el token y vuelve a la página /home
  async logoutUser() {
    try {
      await this.authService.logout();  // elimina el token del storage
      this.userName = null;             // opcional: limpia el nombre mostrado
      this.router.navigateByUrl('/home');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }
}