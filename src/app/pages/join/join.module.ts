import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JoinPageRoutingModule } from './join-routing.module';

import { JoinPage } from './join.page';

import { SwiperModule } from 'swiper/angular';
import { EditSessionUserModule } from 'src/app/components/edit-session-user/edit-session-user.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    JoinPageRoutingModule,
    SwiperModule,
    EditSessionUserModule,
  ],
  declarations: [JoinPage],
})
export class JoinPageModule {}
