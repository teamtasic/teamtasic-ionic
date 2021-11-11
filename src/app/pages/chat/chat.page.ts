import {
  AfterViewInit,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { TrainingDetailViewComponent } from 'src/app/components/training-detail-view/training-detail-view.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {
  @ViewChild(IonContent) content: IonContent;
  constructor(public modalController: ModalController) {}

  ngOnInit() {
    this.presentModal();
  }
  ngAfterViewInit() {
    this.content.scrollToBottom(300);
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: TrainingDetailViewComponent,
    });

    await modal.present();
  }
}
