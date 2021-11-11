import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-training-detail-view',
  templateUrl: './training-detail-view.component.html',
  styleUrls: ['./training-detail-view.component.scss'],
})
export class TrainingDetailViewComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  accepted: boolean = false;
}
