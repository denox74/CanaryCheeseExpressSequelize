// Importa dependencias principales de Angular/Ionic
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Importa servicios propios
import { CheeseService } from '../services/cheese-service';
import { PhotoService } from '../services/photo.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-add-cheese',
  templateUrl: './add-cheese.page.html',
  styleUrls: ['./add-cheese.page.scss'],
  standalone: false,
})
// Página para crear un nuevo queso asociado al usuario logueado
export class AddCheesePage implements OnInit {

  // Formulario reactivo del queso
  cheeseForm: FormGroup;

  // Foto capturada o seleccionada (como data URL / webPath)
  capturedPhoto: string = "";

  // Marca si se ha intentado enviar el formulario
  isSubmitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private cheeseService: CheeseService,
    private router: Router,
    private photoService: PhotoService,
    private storage: Storage
  ) {
    // Configuración del formulario con validaciones básicas
    this.cheeseForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      curation: ['', Validators.compose([Validators.required])],
      weight: ['', Validators.compose([Validators.required])],
      origen: ['', Validators.compose([Validators.required])]
    });
  }

  // Hook de inicialización (por ahora sin lógica extra)
  ngOnInit() {}

  // Obtiene el token del usuario; si no existe, redirige a login
  private async getTokenOrRedirect(): Promise<string | null> {
    await this.storage.create();
    const token = await this.storage.get('token');

    if (!token) {
      console.warn('No hay token, redirigiendo a /login');
      this.router.navigateByUrl('/login');
      return null;
    }

    return token;
  }

  // Crea un queso usando los datos del formulario y la foto capturada
  async createCheese() {
    this.isSubmitted = true;

    if (!this.cheeseForm.valid) {
      console.log('Formulario no válido');
      return;
    }

    // Obtiene el token del usuario
    const token = await this.getTokenOrRedirect();
    if (!token) return;

    console.log('Formulario válido:', this.cheeseForm.value);

    // Convierte la foto (si existe) a blob para enviarla como multipart/form-data
    let blob: Blob | null = null;
    if (this.capturedPhoto !== "") {
      const response = await fetch(this.capturedPhoto);
      blob = await response.blob();
    }

    // Llama al servicio para crear el queso asociado al usuario
    this.cheeseService.create(this.cheeseForm.value, blob, token).subscribe({
      next: response => {
        console.log('Queso creado:', response);
        this.cheeseForm.reset();
        this.capturedPhoto = "";
        this.refreshCurrentRoute('/my-cheeses');
      },
      error: err => {
        console.error('Error creando queso:', err);
      }
    });
  }

  // Atajo usado desde el template para enviar el formulario
  async submitForm() {
    await this.createCheese();
  }

  // Devuelve un control del formulario por nombre (útil en el HTML)
  getFormControl(name: string) {
    return this.cheeseForm.get(name);
  }

  // Navega a la lista de quesos
  gotoMyCheeses() {
    this.router.navigateByUrl("/my-cheeses");
  }

  // Navega a la propia pantalla de añadir queso
  gotoAddCheeses() {
    this.router.navigateByUrl("/add-cheese");
  }

  // Navega a la home del usuario
  gotoHome() {
    this.router.navigateByUrl('/user-home');
  }

  // Toma una foto con la cámara y guarda su ruta
  takePhoto() {
    this.photoService.takePhoto().then(data => {
      this.capturedPhoto = data.webPath ? data.webPath : "";
    });
  }

  // Selecciona una foto de la galería
  pickImage() {
    this.photoService.pickImage().then(data => {
      this.capturedPhoto = data.webPath;
    });
  }

  // Descarta la imagen actual
  discardImage() {
    this.capturedPhoto = "";
  }

  // Fuerza recargar una ruta (truco para refrescar la lista de quesos)
  async refreshCurrentRoute(targetUrl?: string): Promise<boolean> {
    const current = targetUrl ? targetUrl : this.router.url;
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    return this.router.navigateByUrl(current);
  }
}