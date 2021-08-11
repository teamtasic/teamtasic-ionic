import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubAddTeamPageRoutingModule } from './club-add-team-routing.module';

import { ClubAddTeamPage } from './club-add-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClubAddTeamPageRoutingModule
  ],
  declarations: [ClubAddTeamPage]
})
export class ClubAddTeamPageModule {}
