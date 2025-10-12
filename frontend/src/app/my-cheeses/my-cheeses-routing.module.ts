import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCheesesPage } from './my-cheeses.page';

const routes: Routes = [
  {
    path: '',
    component: MyCheesesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCheesesPageRoutingModule {}
