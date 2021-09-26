import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';

import { MeetCreatePagePage } from '../meet-create-page/meet-create-page.page';
@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, Tab2PageRoutingModule],
  declarations: [Tab2Page, MeetCreatePagePage],
})
export class Tab2PageModule {}
