import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestCameraPage } from './test-camera.page';

const routes: Routes = [
  {
    path: '',
    component: TestCameraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCameraPageRoutingModule {}
