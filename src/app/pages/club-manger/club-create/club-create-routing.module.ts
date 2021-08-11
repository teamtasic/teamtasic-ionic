import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubCreatePage } from './club-create.page';

const routes: Routes = [
  {
    path: '',
    component: ClubCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubCreatePageRoutingModule {}
