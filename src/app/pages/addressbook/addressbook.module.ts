import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressbookPageRoutingModule } from './addressbook-routing.module';

import { AddressbookPage } from './addressbook.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressbookPageRoutingModule
  ],
  declarations: [AddressbookPage]
})
export class AddressbookPageModule {}
