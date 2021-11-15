import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-session-user',
  templateUrl: './edit-session-user.component.html',
  styleUrls: ['./edit-session-user.component.scss'],
})
export class EditSessionUserComponent implements OnInit {
  @Input() sessionUserId: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }
}
