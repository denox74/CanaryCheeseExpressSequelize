import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CheeseService } from '../services/cheese-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-cheese',
  templateUrl: './add-cheese.page.html',
  styleUrls: ['./add-cheese.page.scss'],
  standalone: false,
})
export class AddCheesePage implements OnInit {
  
  cheeseForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder, 
    private cheeseService: CheeseService,
    private route: Router,
    private router: Router
  ) {
    this.cheeseForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      curation: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  }

  createCheese() {
    if (this.cheeseForm.valid) {
      console.log('Formulario válido:', this.cheeseForm.value);

      this.cheeseService.create(this.cheeseForm.value).subscribe(response => {
        console.log('Queso creado:', response);
        this.route.navigateByUrl('/my-cheeses');
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
}
