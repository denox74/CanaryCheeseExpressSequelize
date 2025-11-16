// Importa dependencias de Angular/Ionic
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Importa servicios propios
import { CheeseService } from '../services/cheese-service';
import { PhotoService } from '../services/photo.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-mod-cheese',
  templateUrl: './mod-cheese.page.html',
  styleUrls: ['./mod-cheese.page.scss'],
  standalone: false,
})
// Página para modificar un queso del usuario autenticado
export class ModCheesePage implements OnInit {

  // Formulario reactivo del queso
  cheeseForm: FormGroup;

  // Ruta o referencia de la foto actual
  capturedPhoto: string = '';

  // Id del queso a editar
  cheeseId: any = null;

  // Token del usuario logueado
  private token: string | null = null;

  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cheeseService: CheeseService,
    private photoService: PhotoService,
    private storage: Storage
  ) {
    // Configuración del formulario con validaciones
    this.cheeseForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      curation: ['', Validators.compose([Validators.required])],
      weight: ['', Validators.compose([Validators.required])],
      origen: ['', Validators.compose([Validators.required])]
    });
  }

  // Al iniciar: obtenemos token y cargamos el queso
  async ngOnInit() {
    await this.storage.create();
    this.token = await this.storage.get('token');

    // Si no hay token → usuario no logueado
    if (!this.token) {
      console.warn('No hay token en ModCheese, redirigiendo a /login');
      this.router.navigateByUrl('/login');
      return;
    }

    this.cheeseId = this.route.snapshot.paramMap.get('id');

    // Preferimos los datos que vienen en navigation state (más rápido)
    const nav = (history && history.state) ? history.state : null;
    if (nav && nav.cheese) {
      const res = nav.cheese;
      this.cheeseForm.patchValue({
        name: res.name,
        curation: res.curation,
        weight: res.weight,
        origen: res.origen
      });
      if (res.filename) {
        this.capturedPhoto = `http://localhost:8080/images/${res.filename}`;
      }
    } else if (this.cheeseId) {
      this.loadCheese(this.cheeseId);
    }
  }

  // Carga un queso por id desde el backend (usando token)
  loadCheese(id: any) {
    if (!this.token) return;

    this.cheeseService.getById(id, this.token).subscribe({
      next: (res: any) => {
        console.log('loadCheese response:', res);
        if (res) {
          this.cheeseForm.patchValue({
            name: res.name,
            curation: res.curation,
            weight: res.weight,
            origen: res.origen
          });

          // Si hay filename en el queso, mostramos la foto actual desde el servidor
          if (res.filename) {
            this.capturedPhoto = `http://localhost:8080/images/${res.filename}`;
          }
        }
      },
      error: (err: any) => {
        console.error('Error loading cheese:', err);
        if (err.status === 401) {
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

  // Atajo para obtener controles del formulario desde el template
  getFormControl(name: string) {
    return this.cheeseForm.get(name);
  }

  // Actualiza el queso con o sin nueva imagen
  async updateCheese() {
    if (!this.cheeseForm.valid) {
      return;
    }

    if (!this.token) {
      console.warn('Sin token al actualizar, redirigiendo a /login');
      this.router.navigateByUrl('/login');
      return;
    }

    let blob: any = null;
    console.log('updateCheese: capturedPhoto=', this.capturedPhoto);

    try {
      if (this.capturedPhoto) {
        // Si es string y viene del servidor (/images/...), no cambiamos la imagen
        if (typeof this.capturedPhoto === 'string' && this.capturedPhoto.includes('/images/')) {
          console.log('updateCheese: usando imagen de servidor ya existente (no se sube nueva).');
        } else if (typeof this.capturedPhoto === 'string') {
          // Si es una ruta web (cámara / galería), la convertimos a blob
          const response = await fetch(this.capturedPhoto);
          blob = await response.blob();
          console.log('updateCheese: blob size=', blob.size, 'type=', blob.type);
        } else if (typeof this.capturedPhoto === 'object' && (this.capturedPhoto as any).webPath) {
          // Algún tipo de objeto foto con webPath
          const response = await fetch((this.capturedPhoto as any).webPath);
          blob = await response.blob();
          console.log('updateCheese: blob from photo object, size=', blob.size);
        } else {
          console.warn('updateCheese: capturedPhoto tiene un tipo inesperado', typeof this.capturedPhoto);
        }
      }
    } catch (err) {
      console.error('Error convirtiendo la imagen a blob:', err);
      blob = null;
    }

    const payload = this.cheeseForm.value;
    console.log('updateCheese: sending payload=', payload, 'hasBlob=', !!blob);

    try {
      this.cheeseService.update(this.cheeseId, payload, blob, this.token).subscribe({
        next: async (res: any) => {
          // Si el servidor devuelve filename nuevo, actualizamos la vista previa
          if (res && res.filename) {
            this.capturedPhoto = `http://localhost:8080/images/${res.filename}`;
          }
          // Volvemos a la lista de quesos (forzando recarga)
          await this.refreshCurrentRoute('/my-cheeses');
        },
        error: (err) => {
          console.error('Update failed:', err);
          if (err.status === 401) {
            this.router.navigateByUrl('/login');
          }
        }
      });
    } catch (err) {
      console.error('Unexpected error calling update:', err);
    }
  }

  // Fuerza un refresco de la ruta indicada
  async refreshCurrentRoute(targetUrl?: string): Promise<boolean> {
    const current = targetUrl ? targetUrl : this.router.url;
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    return this.router.navigateByUrl(current);
  }

  // Toma una foto desde la cámara
  takePhoto() {
    this.photoService.takePhoto().then(data => {
      this.capturedPhoto = data.webPath ? data.webPath : '';
    });
  }

  // Selecciona una imagen de la galería
  pickImage() {
    this.photoService.pickImage().then(data => {
      this.capturedPhoto = data.webPath;
    });
  }

  // Descarta la imagen actual
  discardImage() {
    this.capturedPhoto = '';
  }
}