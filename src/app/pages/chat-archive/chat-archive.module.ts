import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatArchivePageRoutingModule } from './chat-archive-routing.module';

import { ChatArchivePage } from './chat-archive.page';
import { TrainingbubbleModuleModule } from 'src/app/components/trainingbubble-module/trainingbubble-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatArchivePageRoutingModule,
    TrainingbubbleModuleModule,
  ],
  declarations: [ChatArchivePage],
})
export class ChatArchivePageModule {}
