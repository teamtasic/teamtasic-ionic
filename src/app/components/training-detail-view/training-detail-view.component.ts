import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-training-detail-view',
  templateUrl: './training-detail-view.component.html',
  styleUrls: ['./training-detail-view.component.scss'],
})
export class TrainingDetailViewComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  @Input() meetId: string;
  @Input() sessionId: string;

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  status: 'accepted' | 'declined' | 'unknown' = 'unknown';
  trainersOpen: boolean = false;
  usersOpen: boolean = true;

  change(event) {
    this.status = event.detail.value;
  }
  toggleTrainers() {
    this.trainersOpen = !this.trainersOpen;
  }
  toggleUsers() {
    this.usersOpen = !this.usersOpen;
  }
}
