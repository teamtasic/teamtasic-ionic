import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { TrainingDetailViewComponent } from '../training-detail-view/training-detail-view.component';

@Component({
  selector: 'trainingbubble',
  templateUrl: './trainingbubble.component.html',
  styleUrls: ['./trainingbubble.component.scss'],
})
export class TrainingbubbleComponent implements OnInit {
  @Input() meet: Meet;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log(
      '----------------------------------------------------------------------------------------------------',
      this.meet
    );
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TrainingDetailViewComponent,
      componentProps: {
        meet: this.meet,
      },
    });

    await modal.present();
  }
}
