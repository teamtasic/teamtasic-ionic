import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatArchivePageRoutingModule } from './chat-archive-routing.module';

import { ChatArchivePage } from './chat-archive.page';
import { TrainingbubbleComponent } from 'src/app/components/trainingbubble/trainingbubble.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatArchivePageRoutingModule],
  declarations: [ChatArchivePage, TrainingbubbleComponent],
})
export class ChatArchivePageModule {}
