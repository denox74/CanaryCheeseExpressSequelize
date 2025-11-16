import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  name: string = "BH";
  curation: string= "star";

  constructor(private router: Router) {}

  gotoMyCheeses(){
    this.router.navigateByUrl("/my-cheeses");
  }
      gotoAddCheeses(){
    this.router.navigateByUrl("/add-cheese");
  }
gotoHome(){
    this.router.navigateByUrl("/home");
  }

  gotoLogin(){
    this.router.navigateByUrl("/login");
  }

}
