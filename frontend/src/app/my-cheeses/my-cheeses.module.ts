import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCheesesPageRoutingModule } from './my-cheeses-routing.module';

import { MyCheesesPage } from './my-cheeses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyCheesesPageRoutingModule
  ],
  declarations: [MyCheesesPage]
})
export class MyCheesesPageModule {}
