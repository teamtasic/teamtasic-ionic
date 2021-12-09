import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressbookPageRoutingModule } from './addressbook-routing.module';

import { AddressbookPage } from './addressbook.page';
import { SessionUserViewComponent } from 'src/app/components/session-user-view/session-user-view.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AddressbookPageRoutingModule],
  declarations: [AddressbookPage, SessionUserViewComponent],
})
export class AddressbookPageModule {}
