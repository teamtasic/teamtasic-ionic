import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyClubsPage } from './my-clubs.page';

const routes: Routes = [
  {
    path: '',
    component: MyClubsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyClubsPageRoutingModule {}
