import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressbookPage } from './addressbook.page';

const routes: Routes = [
  {
    path: ':sessionId/:clubId/:teamId',
    component: AddressbookPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddressbookPageRoutingModule {}
