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
  },
  {
    path: 'mod-cheese',
    loadChildren: () => import('./mod-cheese/mod-cheese.module').then( m => m.ModCheesePageModule)
  },  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'user-home',
    loadChildren: () => import('./user-home/user-home.module').then( m => m.UserHomePageModule)
  },


 

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
