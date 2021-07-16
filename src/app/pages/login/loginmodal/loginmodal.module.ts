import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginmodalPageRoutingModule } from './loginmodal-routing.module';

import { LoginmodalPage } from './loginmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginmodalPageRoutingModule
  ],
  declarations: [LoginmodalPage]
})
export class LoginmodalPageModule {}
