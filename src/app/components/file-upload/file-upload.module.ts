import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [CommonModule, IonicModule],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}
