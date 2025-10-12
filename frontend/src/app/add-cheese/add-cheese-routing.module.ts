import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCheesePage } from './add-cheese.page';

const routes: Routes = [
  {
    path: '',
    component: AddCheesePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCheesePageRoutingModule {}
