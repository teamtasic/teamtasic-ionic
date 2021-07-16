import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginmodalPage } from './loginmodal.page';

const routes: Routes = [
  {
    path: '',
    component: LoginmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginmodalPageRoutingModule {}
