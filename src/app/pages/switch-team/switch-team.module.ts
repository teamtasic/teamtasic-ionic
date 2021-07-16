import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwitchTeamPageRoutingModule } from './switch-team-routing.module';

import { SwitchTeamPage } from './switch-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwitchTeamPageRoutingModule
  ],
  declarations: [SwitchTeamPage]
})
export class SwitchTeamPageModule {}
