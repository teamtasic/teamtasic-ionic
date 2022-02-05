import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutologinGuard } from './guards/autologin.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canLoad: [AutologinGuard],
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'reset',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then((m) => m.ResetPasswordPageModule),
    canLoad: [AutologinGuard],
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then((m) => m.SignupPageModule),
    canLoad: [AutologinGuard],
  },
  {
    path: 'my-clubs',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/my-clubs/my-clubs.module').then((m) => m.MyClubsPageModule),
      },
      {
        path: 'create-club',
        loadChildren: () =>
          import('./pages/club-manger/club-create/club-create.module').then(
            (m) => m.ClubCreatePageModule
          ),
      },
      {
        path: 'detail',
        redirectTo: 'detail/0',
      },
      {
        path: 'detail/:clubId',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/club-manger/club-detail-view/club-detail-view.module').then(
                (m) => m.ClubDetailViewPageModule
              ),
          },
          {
            path: 'add-team',
            loadChildren: () =>
              import('./pages/club-manger/club-add-team/club-add-team.module').then(
                (m) => m.ClubAddTeamPageModule
              ),
          },
          {
            path: 'edit-team/:teamId',
            loadChildren: () =>
              import('./pages/club-manger/club-edit-team/club-edit-team.module').then(
                (m) => m.ClubEditTeamPageModule
              ),
          },
        ],
      },
    ],
    canLoad: [AuthGuard],
  },
  {
    path: 'my-account',
    loadChildren: () =>
      import('./pages/my-account/my-account.module').then((m) => m.MyAccountPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./pages/privacy-policy/privacy-policy.module').then((m) => m.PrivacyPolicyPageModule),
  },
  // {
  //   path: '',
  //   redirectTo: 'join/4gr3DNHhh2TqtF0Im3ax',
  //   pathMatch: 'full',
  // },
  {
    path: 'join/:joinCode',
    loadChildren: () => import('./pages/join/join.module').then((m) => m.JoinPageModule),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
