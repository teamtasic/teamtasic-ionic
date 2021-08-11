import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubAddTeamPage } from './club-add-team.page';

const routes: Routes = [
  {
    path: '',
    component: ClubAddTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubAddTeamPageRoutingModule {}
