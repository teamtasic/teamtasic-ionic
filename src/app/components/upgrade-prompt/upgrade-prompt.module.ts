import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpgradePromptComponent } from './upgrade-prompt.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  declarations: [UpgradePromptComponent],
  exports: [UpgradePromptComponent],
})
export class UpgradePromptModule {}
