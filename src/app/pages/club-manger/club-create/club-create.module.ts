import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubCreatePageRoutingModule } from './club-create-routing.module';

import { ClubCreatePage } from './club-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClubCreatePageRoutingModule,
  ],
  declarations: [ClubCreatePage],
})
export class ClubCreatePageModule {}
