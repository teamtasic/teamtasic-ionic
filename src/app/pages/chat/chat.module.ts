import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { TextbubbleComponent } from 'src/app/components/textbubble/textbubble.component';
import { MeetCreateComponent } from 'src/app/components/meet-create/meet-create.component';
import { TrainingbubbleModuleModule } from 'src/app/components/trainingbubble/trainingbubble-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ChatPageRoutingModule,
    TrainingbubbleModuleModule,
  ],
  declarations: [ChatPage, TextbubbleComponent, MeetCreateComponent],
})
export class ChatPageModule {}
