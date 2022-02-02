import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditSessionUserComponent } from './edit-session-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FileUploadModule } from '../file-upload/file-upload.module';

@NgModule({
  declarations: [EditSessionUserComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, FileUploadModule],
  exports: [EditSessionUserComponent],
})
export class EditSessionUserModule {}
