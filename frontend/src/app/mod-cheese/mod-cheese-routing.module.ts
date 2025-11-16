import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModCheesePage} from './mod-cheese.page';

const routes: Routes = [
  {
    path: ':id',
    component: ModCheesePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModCheesePageRoutingModule {}
