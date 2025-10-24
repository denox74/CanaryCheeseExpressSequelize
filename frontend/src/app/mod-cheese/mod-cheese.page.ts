import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CheeseService } from '../services/cheese-service';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-mod-cheese',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mod-cheese.page.html',
  styleUrls: ['./mod-cheese.page.scss'],
})
export class ModCheesePage implements OnInit {

  cheeseForm: FormGroup;
  capturedPhoto: string = "";
  cheeseId: any = null;

  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cheeseService: CheeseService,
    private photoService: PhotoService
  ) {
    this.cheeseForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      curation: ['', Validators.compose([Validators.required])],
      weight: ['', Validators.compose([Validators.required])],
      origen: ['', Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
    this.cheeseId = this.route.snapshot.paramMap.get('id');
    // Prefer navigation state (faster) if available
    const nav = (history && history.state) ? history.state : null;
    if (nav && nav.cheese) {
      const res = nav.cheese;
      this.cheeseForm.patchValue({
        name: res.name,
        curation: res.curation,
        weight: res.weight,
        origen: res.origen
      });
      if (res.filename) this.capturedPhoto = `http://localhost:8080/images/${res.filename}`;
    } else if (this.cheeseId) {
      this.loadCheese(this.cheeseId);
    }
  }

  loadCheese(id: any) {
    this.cheeseService.getById(id).subscribe({
      next: (res: any) => {
        console.log('loadCheese response:', res);
        if (res) {
          this.cheeseForm.patchValue({
            name: res.name,
            curation: res.curation,
            weight: res.weight,
            origen: res.origen
          });
          // if you have filename or URL, set capturedPhoto to show preview
          if (res.filename) {
            // use absolute URL to backend so image is loaded from server
            this.capturedPhoto = `http://localhost:8080/images/${res.filename}`;
          }
        }
      },
      error: (err: any) => {
        console.error('Error loading cheese:', err);
      }
    });
  }

  getFormControl(name: string) {
    return this.cheeseForm.get(name);
  }

  async updateCheese() {
    if (this.cheeseForm.valid) {
      let blob: any = null;
      console.log('updateCheese: capturedPhoto=', this.capturedPhoto);
      try {
        if (this.capturedPhoto) {
          // If it's already a Blob/File, use it
          // Detect Blob/File-like objects by presence of size/type properties (duck-typing)
          if (this.capturedPhoto && typeof this.capturedPhoto === 'object' && ('size' in this.capturedPhoto || 'type' in this.capturedPhoto)) {
            blob = this.capturedPhoto as any;
            console.log('updateCheese: capturedPhoto is Blob/File-like, size=', (blob && blob.size));
          } else if (typeof this.capturedPhoto === 'string') {
            // If it's a server image URL, don't fetch
            if (this.capturedPhoto.includes('/images/')) {
              console.log('updateCheese: using existing server image or no image change');
            } else {
              // try fetch for data:, blob:, http(s): or file: URIs
              const response = await fetch(this.capturedPhoto);
              blob = await response.blob();
              console.log('updateCheese: blob size=', blob.size, 'type=', blob.type);
            }
          } else if (typeof this.capturedPhoto === 'object' && (this.capturedPhoto as any).webPath) {
            // some Photo objects may be stored directly
            const response = await fetch((this.capturedPhoto as any).webPath);
            blob = await response.blob();
            console.log('updateCheese: blob from photo object, size=', blob.size);
          } else {
            console.warn('updateCheese: capturedPhoto has unexpected type', typeof this.capturedPhoto);
          }
        }
      } catch (err) {
        console.error('Error converting image to blob:', err);
        blob = null;
      }

      const payload = this.cheeseForm.value;
      console.log('updateCheese: sending payload=', payload, 'hasBlob=', !!blob);
      try {
        this.cheeseService.update(this.cheeseId, payload, blob).subscribe({
          next: async (res: any) => {
            // if server returned updated object with filename, update preview
            if (res && res.filename) {
              this.capturedPhoto = `http://localhost:8080/images/${res.filename}`;
            }
            // navegar a la lista y forzar recarga simple
            await this.refreshCurrentRoute('/my-cheeses');
          },
          error: (err) => {
            console.error('Update failed:', err);
          }
        });
      } catch (err) {
        console.error('Unexpected error calling update:', err);
      }
    }
  }

  /**
   * Refresca la ruta indicada (o la actual si no se pasa) usando una navegación "neutra".
   */
  async refreshCurrentRoute(targetUrl?: string): Promise<boolean> {
    const current = targetUrl ? targetUrl : this.router.url;
    await this.router.navigateByUrl('/', { skipLocationChange: true });
    return this.router.navigateByUrl(current);
  }

  takePhoto() {
    this.photoService.takePhoto().then(data => {
      this.capturedPhoto = data.webPath? data.webPath : "";
    });
  }

  pickImage() {
    this.photoService.pickImage().then(data => {
      this.capturedPhoto = data.webPath;
    });
  }

  discardImage() {
    this.capturedPhoto = "";
  }

}
