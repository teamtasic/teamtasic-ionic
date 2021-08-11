import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyClubsPageRoutingModule } from './my-clubs-routing.module';

import { MyClubsPage } from './my-clubs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyClubsPageRoutingModule
  ],
  declarations: [MyClubsPage]
})
export class MyClubsPageModule {}
