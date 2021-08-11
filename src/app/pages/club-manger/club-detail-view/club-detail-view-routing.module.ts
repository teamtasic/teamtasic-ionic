import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubDetailViewPage } from './club-detail-view.page';

const routes: Routes = [
  {
    path: '',
    component: ClubDetailViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubDetailViewPageRoutingModule {}
