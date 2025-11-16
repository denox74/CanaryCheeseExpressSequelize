import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheeseService } from '../services/cheese-service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-my-cheeses',
  templateUrl: './my-cheeses.page.html',
  styleUrls: ['./my-cheeses.page.scss'],
  standalone: false
})
// Página que muestra y gestiona los quesos del usuario logueado
export class MyCheesesPage implements OnInit {

  // Lista de quesos cargados desde la API
  cheeses: any = [];

  // Estado temporal para edición rápida
  editId: any = null;
  editName: string = '';
  editCuration: string = '';

  constructor(
    private cheeseService: CheeseService,
    private router: Router,
    private storage: Storage
  ) {}

  // Al iniciar la página, carga los quesos del usuario
  ngOnInit() {
    this.getAllCheeses();
  }

  // Obtiene el token del usuario y pide sus quesos al backend
  async getAllCheeses() {
    await this.storage.create();
    const token = await this.storage.get('token');

    // Si no hay token, redirige a login
    if (!token) {
      console.warn('No hay token, redirigiendo a /login');
      this.router.navigateByUrl('/login');
      return;
    }

    // Llama al servicio pasando el token para que añada el Bearer
    this.cheeseService.getCheeses(token).subscribe({
      next: (response: any) => {
        this.cheeses = response;
      },
      error: err => {
        console.error('Error cargando quesos:', err);
        if (err.status === 401) {
          this.router.navigateByUrl('/login');
        }
      }
    });
  }

  // Elimina un queso y recarga la lista
  async deleteCheese(id: any) {
    await this.storage.create();
    const token = await this.storage.get('token');

    if (!token) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.cheeseService.delete(id, token).subscribe(() => {
      this.getAllCheeses();
    });
  }

  // Carga datos del queso en los campos de edición rápida
  startEdit(cheese: any) {
    this.editId = cheese.id;
    this.editName = cheese.name;
    this.editCuration = cheese.curation;
  }

  // Navega a la página de edición avanzada
  goToEdit(cheese: any) {
    this.router.navigate(['/mod-cheese', cheese.id], { state: { cheese } });
  }

  // Confirma la edición rápida y actualiza el queso
  async confirmEdit(id: any) {
    const updatedCheese = {
      name: this.editName,
      curation: this.editCuration
    };

    await this.storage.create();
    const token = await this.storage.get('token');

    if (!token) {
      console.warn('No hay token en confirmEdit, redirigiendo a /login');
      this.router.navigateByUrl('/login');
      return;
    }

    this.cheeseService.update(id, updatedCheese, null, token).subscribe(() => {
      this.editId = null;
      this.editName = '';
      this.editCuration = '';
      this.getAllCheeses();
    });
  }

  // Cancela la edición rápida
  cancelEdit() {
    this.editId = null;
    this.editName = '';
    this.editCuration = '';
  }

  // Navega a la propia página (por si la llamas desde el footer)
  gotoMyCheeses() {
    this.router.navigateByUrl('/my-cheeses');
  }

  // Navega a la página para añadir un queso nuevo
  gotoAddCheeses() {
    this.router.navigateByUrl('/add-cheese');
  }

  // Navega a la home del usuario
  gotoHome() {
    this.router.navigateByUrl('/user-home');
  }
}
