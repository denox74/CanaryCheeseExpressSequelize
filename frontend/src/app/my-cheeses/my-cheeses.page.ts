import { Component, OnInit } from '@angular/core';
import { CheeseService} from '../services/cheese-service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-cheeses',
  templateUrl: './my-cheeses.page.html',
  styleUrls: ['./my-cheeses.page.scss'],
  standalone: false
})
export class MyCheesesPage implements OnInit {

  cheeses: any= [];

  editId: any = null;
  editName: string = '';
  editCuration: string = '';

  constructor (private cheeseService: CheeseService, private router: Router){}

  ngOnInit(){
    this.getAllCheeses();
  }

  getAllCheeses(){
    this.cheeseService.getCheeses().subscribe(response => {
      this.cheeses = response;
    });
  }

  deleteCheese(id: any) {
    this.cheeseService.delete(id).subscribe(response => {
      this.getAllCheeses();
    });
  }
startEdit(cheese: any) {
  this.editId = cheese.id;
  this.editName = cheese.name;
  this.editCuration = cheese.curation;
}

goToEdit(cheese: any) {
  // navigate to the mod-cheese page with the cheese id, passing the cheese object in state
  this.router.navigate(['/mod-cheese', cheese.id], { state: { cheese } });
}
  confirmEdit(id: any) {
  const updatedCheese = {
    name: this.editName,
    curation: this.editCuration
  };
  this.cheeseService.update(id, updatedCheese).subscribe(response => {
    this.editId = null;
    this.editName = '';
    this.editCuration = '';
    this.getAllCheeses();
  });
}

  cancelEdit() {
    this.editId = null;
    this.editName = '';
    this.editCuration = '';
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