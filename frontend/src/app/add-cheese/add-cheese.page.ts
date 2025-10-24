import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheeseService } from '../services/cheese-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-add-cheese',
  templateUrl: './add-cheese.page.html',
  styleUrls: ['./add-cheese.page.scss'],
  standalone: false,
})
export class AddCheesePage implements OnInit {
  
  cheeseForm: FormGroup;
  capturedPhoto: string = "";
  isSubmitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder, 
    private cheeseService: CheeseService,
    private router: Router,
    private photoService: PhotoService,
  ) {
    this.cheeseForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      curation: ['', Validators.compose([Validators.required])],
      weight: ['', Validators.compose([Validators.required])],
      origen: ['', Validators.compose([Validators.required])]

    });
  }

  ngOnInit() {
  }

  async createCheese() {
    if (this.cheeseForm.valid) {
      console.log('Formulario válido:', this.cheeseForm.value);
      let blob = null;
      if (this.capturedPhoto != "") {
        const response = await fetch(this.capturedPhoto);
        blob = await response.blob();
      }

      this.cheeseService.create(this.cheeseForm.value, blob).subscribe(response => {
        console.log('Queso creado:', response);
        // limpiar formulario y preview
        this.cheeseForm.reset();
        this.capturedPhoto = "";
        // navegar a la lista y forzar recarga simple
        this.refreshCurrentRoute('/my-cheeses');
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  getFormControl(name: string) {
    return this.cheeseForm.get(name);
  }

  gotoMyCheeses(){
    this.router.navigateByUrl("/my-cheeses");
  }
      gotoAddCheeses(){
    this.router.navigateByUrl("/add-cheese");
  }
gotoHome(){
    this.router.navigateByUrl("/home");
  }


   takePhoto() {
    this.photoService.takePhoto().then(data => {
      this.capturedPhoto = data.webPath? data.webPath : "";
    });
  }

  pickImage() {
    this.photoService.pickImage().then(data => {
      this.capturedPhoto = data.webPath;
    });
  }
    discardImage() {
    this.capturedPhoto = "";
  }

  async submitForm() {
    this.isSubmitted = true;
    if (!this.cheeseForm.valid) {
      console.log('Please provide all the required values!')
      return;
    } else {
      let blob = null;
      if (this.capturedPhoto != "") {
        const response = await fetch(this.capturedPhoto);
        blob = await response.blob();
      }

      this.cheeseService.create(this.cheeseForm.value, blob).subscribe(data => {
        console.log("Photo sent!");
        // limpiar y volver a la lista de quesos (y forzar recarga)
        this.cheeseForm.reset();
        this.capturedPhoto = "";
        this.refreshCurrentRoute('/my-cheeses');
      })
    }
  }

  /**
   * Refresca la ruta indicada (o la actual si no se pasa) usando una navegación "neutra".
   * Esto fuerza que el componente asociado se vuelva a cargar.
   */
  async refreshCurrentRoute(targetUrl?: string): Promise<boolean> {
    const current = targetUrl ? targetUrl : this.router.url;
    // navegar a una ruta neutra sin cambiar la URL visible y volver a la ruta deseada
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    return this.router.navigateByUrl(current);
  }

}
