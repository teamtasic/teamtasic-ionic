import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAccountPageRoutingModule } from './my-account-routing.module';

import { MyAccountPage } from './my-account.page';
import { Clipboard } from '@capacitor/clipboard';
import { EditSessionUserComponent } from 'src/app/components/edit-session-user/edit-session-user.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MyAccountPageRoutingModule,
  ],
  declarations: [MyAccountPage, EditSessionUserComponent],
  providers: [],
})
export class MyAccountPageModule {}
