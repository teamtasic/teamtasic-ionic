import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // {
      //   path: 'tab1',
      //   loadChildren: () => import('../tab1/tab1.module').then((m) => m.Tab1PageModule),
      // },
      {
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: () => import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
          },
          {
            path: 'chat',
            loadChildren: () => import('../chat/chat.module').then((m) => m.ChatPageModule),
          },
          {
            path: 'addressbook',
            loadChildren: () =>
              import('../../pages/addressbook/addressbook.module').then(
                (m) => m.AddressbookPageModule
              ),
          },
          {
            path: 'chat-archive',
            loadChildren: () =>
              import('../../pages/chat-archive/chat-archive.module').then(
                (m) => m.ChatArchivePageModule
              ),
          },
        ],
      },
      // {
      //   path: 'tab3',
      //   loadChildren: () => import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
      // },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then((m) => m.Tab4PageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/tab2',
        pathMatch: 'prefix',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
