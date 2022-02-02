import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAccountPageRoutingModule } from './my-account-routing.module';

import { MyAccountPage } from './my-account.page';
import { Clipboard } from '@capacitor/clipboard';
import { EditSessionUserComponent } from 'src/app/components/edit-session-user/edit-session-user.component';
import { FileUploadModule } from 'src/app/components/file-upload/file-upload.module';
import { EditSessionUserModule } from 'src/app/components/edit-session-user/edit-session-user.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MyAccountPageRoutingModule,
    FileUploadModule,
    EditSessionUserModule,
  ],
  declarations: [MyAccountPage],
})
export class MyAccountPageModule {}
