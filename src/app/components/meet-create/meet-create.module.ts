import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetCreateComponent } from './meet-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TaskManagerComponent } from '../task-manager/task-manager.component';
import { TaskManagerModule } from '../task-manager/task-manager.module';

@NgModule({
  declarations: [MeetCreateComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, TaskManagerModule],
  exports: [MeetCreateComponent],
})
export class MeetCreateModule {}
