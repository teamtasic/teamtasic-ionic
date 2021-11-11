import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TrainingDetailViewComponent } from 'src/app/components/training-detail-view/training-detail-view.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {
    this.presentModal();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: TrainingDetailViewComponent,
    });

    await modal.present();
  }
}
