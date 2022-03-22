import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TaskManagerComponent } from './task-manager.component';

@NgModule({
  declarations: [TaskManagerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [TaskManagerComponent],
})
export class TaskManagerModule {}
