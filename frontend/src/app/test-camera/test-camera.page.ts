// Importa dependencias principales de Angular/Ionic
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Importa tu servicio de cámara/fotos
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-test-camera',
  templateUrl: './test-camera.page.html',
  styleUrls: ['./test-camera.page.scss'],
  standalone: false,
})
export class TestCameraPage implements OnInit {

  // Foto capturada o seleccionada (webPath / dataURL)
  capturedPhoto: string = '';

  constructor(
    private photoService: PhotoService,
    private router: Router
  ) {}

  ngOnInit() {}

  // Toma una foto con la cámara
  takePhoto() {
    this.photoService.takePhoto().then(data => {
      this.capturedPhoto = data.webPath ? data.webPath : '';
      console.log('Foto tomada:', this.capturedPhoto);
    }).catch(err => {
      console.error('Error al hacer foto:', err);
    });
  }

  // Elige una imagen de la galería
  pickImage() {
    this.photoService.pickImage().then(data => {
      this.capturedPhoto = data.webPath;
      console.log('Imagen elegida:', this.capturedPhoto);
    }).catch(err => {
      console.error('Error al escoger imagen:', err);
    });
  }

  // Quita la imagen actual
  discardImage() {
    this.capturedPhoto = '';
    console.log('Imagen descartada');
  }

  // (Opcional) Volver a la home
  gotoHome() {
    this.router.navigateByUrl('home');
  }
}