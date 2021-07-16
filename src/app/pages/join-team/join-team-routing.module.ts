import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinTeamPage } from './join-team.page';

const routes: Routes = [
  {
    path: '',
    component: JoinTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JoinTeamPageRoutingModule {}
