import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'my-cheeses',
    loadChildren: () => import('./my-cheeses/my-cheeses.module').then( m => m.MyCheesesPageModule)
  },
  {
    path: 'add-cheese',
    loadChildren: () => import('./add-cheese/add-cheese.module').then( m => m.AddCheesePageModule)
  },  {
    path: 'mod-cheese',
    loadChildren: () => import('./mod-cheese/mod-cheese.module').then( m => m.ModCheesePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
