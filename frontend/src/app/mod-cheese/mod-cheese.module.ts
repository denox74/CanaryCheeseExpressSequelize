import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModCheesePageRoutingModule } from './mod-cheese-routing.module';

import { ModCheesePage } from './mod-cheese.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ModCheesePageRoutingModule,
    ModCheesePage
  ],
  declarations: []
})
export class ModCheesePageModule {}
