import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddCheesePageRoutingModule } from './add-cheese-routing.module';

import { AddCheesePage } from './add-cheese.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AddCheesePageRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [AddCheesePage]
})
export class AddCheesePageModule {}
