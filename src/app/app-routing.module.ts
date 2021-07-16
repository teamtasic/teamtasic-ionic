import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { AutologinGuard } from './guards/autologin.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    canLoad: [AutologinGuard],
    canActivate: [AutologinGuard],
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: 'switch-team',
    loadChildren: () =>
      import('./pages/switch-team/switch-team.module').then(
        (m) => m.SwitchTeamPageModule
      ),
  },
  {
    path: 'join-team',
    loadChildren: () =>
      import('./pages/join-team/join-team.module').then(
        (m) => m.JoinTeamPageModule
      ),
  },
  {
    path: 'create-team',
    loadChildren: () =>
      import('./pages/create-team/create-team.module').then(
        (m) => m.CreateTeamPageModule
      ),
  },
  {
    path: 'reset',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'chat-view/:id',
    loadChildren: () =>
      import('./pages/chat-view/chat-view.module').then(
        (m) => m.ChatViewPageModule
      ),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
