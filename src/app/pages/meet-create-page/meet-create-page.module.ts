import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetCreatePagePageRoutingModule } from './meet-create-page-routing.module';

import { MeetCreatePagePage } from './meet-create-page.page';
import { Tab2PageModule } from '../tab2/tab2.module';
import { Tab2Page } from '../tab2/tab2.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, MeetCreatePagePageRoutingModule, Tab2Page],
  declarations: [MeetCreatePagePage],
})
export class MeetCreatePagePageModule {}
