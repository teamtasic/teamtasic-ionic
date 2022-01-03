import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatArchivePage } from './chat-archive.page';

const routes: Routes = [
  {
    path: '',
    component: ChatArchivePage,
  },
  {
    path: ':sessionId/:clubId/:teamId',
    component: ChatArchivePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatArchivePageRoutingModule {}
