import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetCreateComponent } from './meet-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [MeetCreateComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [MeetCreateComponent],
})
export class MeetCreateModule {}
