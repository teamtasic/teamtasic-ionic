import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwitchTeamPage } from './switch-team.page';

const routes: Routes = [
  {
    path: '',
    component: SwitchTeamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwitchTeamPageRoutingModule {}
