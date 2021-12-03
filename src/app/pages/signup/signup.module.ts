import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { MembershipsManagerComponent } from 'src/app/components/memberships-manager/memberships-manager.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, SignupPageRoutingModule],
  declarations: [SignupPage, MembershipsManagerComponent],
  providers: [],
})
export class SignupPageModule {}
