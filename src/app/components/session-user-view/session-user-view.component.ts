import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SessionUserData } from 'src/app/classes/session-user-data';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-session-user-view',
  templateUrl: './session-user-view.component.html',
  styleUrls: ['./session-user-view.component.scss'],
})
export class SessionUserViewComponent implements OnInit {
  @Input() userId: string = '';
  user: SessionUserData | undefined;
  constructor(public drs: DataRepositoryService, private modalController: ModalController) {}

  ngOnInit() {
    this.init();
  }
  async init() {
    this.user = await this.drs.getSessionUser(this.userId);
  }
  dismiss() {
    this.modalController.dismiss();
  }
}
