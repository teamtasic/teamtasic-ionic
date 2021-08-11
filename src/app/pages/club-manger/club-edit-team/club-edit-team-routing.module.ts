import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubEditTeamPage } from './club-edit-team.page';

const routes: Routes = [
  {
    path: '',
    component: ClubEditTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubEditTeamPageRoutingModule {}
