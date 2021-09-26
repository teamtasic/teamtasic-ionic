import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetCreatePagePage } from './meet-create-page.page';

const routes: Routes = [
  {
    path: '',
    component: MeetCreatePagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetCreatePagePageRoutingModule {}
