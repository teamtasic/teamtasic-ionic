import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubDetailViewPageRoutingModule } from './club-detail-view-routing.module';

import { ClubDetailViewPage } from './club-detail-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClubDetailViewPageRoutingModule
  ],
  declarations: [ClubDetailViewPage]
})
export class ClubDetailViewPageModule {}
