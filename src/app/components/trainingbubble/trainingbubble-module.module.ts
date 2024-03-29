import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingbubbleComponent } from './trainingbubble.component';
import { IonicModule } from '@ionic/angular';
import { TrainingDetailViewComponent } from '../training-detail-view/training-detail-view.component';
import { AdminSetMemberStatusComponent } from '../admin-set-member-status/admin-set-member-status.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
  declarations: [
    TrainingbubbleComponent,
    TrainingDetailViewComponent,
    AdminSetMemberStatusComponent,
  ],
  exports: [TrainingbubbleComponent, TrainingDetailViewComponent, AdminSetMemberStatusComponent],
})
export class TrainingbubbleModuleModule {}
