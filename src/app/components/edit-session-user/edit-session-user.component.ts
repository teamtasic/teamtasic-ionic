import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SessionUserData } from 'src/app/classes/session-user-data';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-edit-session-user',
  templateUrl: './edit-session-user.component.html',
  styleUrls: ['./edit-session-user.component.scss'],
})
export class EditSessionUserComponent implements OnInit {
  @Input() session: SessionUserData;
  @Input() newSession: Boolean;

  dataFrom: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    birthdate: [''],
    phone: [''],
    emergency: [''],
  });

  joinForm: FormGroup = this.fb.group({
    code: [''],
  });

  constructor(
    private modalController: ModalController,
    public drs: DataRepositoryService,
    private fb: FormBuilder,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    console.log(this.session, this.newSession);
    if (this.newSession) {
      this.session = new SessionUserData('', this.drs.authUsers.value[0].uid, '', '', '', '', '');
    } else {
      this.dataFrom = this.fb.group({
        name: [this.session.name || '', Validators.required],
        email: [this.session.email || '', Validators.required],
        birthdate: [this.session.birthdate || '', Validators.required],
        phone: [this.session.phoneNumber || '', Validators.required],
        emergency: [this.session.emergencyContact || '', Validators.required],
      });
      console.log(this.dataFrom);
    }
  }
  saveAndDismiss() {
    try {
      if (this.newSession) {
        this.session = new SessionUserData(
          '',
          this.drs.authUsers.value[0].uid,
          this.dataFrom.value.name,
          this.dataFrom.value.email,
          this.dataFrom.value.birthdate,
          this.dataFrom.value.phone,
          this.dataFrom.value.emergency
        );
        this.drs.createSessionUser(this.session, this.drs.authUsers.value[0].uid);
      } else {
        let _sess = new SessionUserData(
          '',
          this.drs.authUsers.value[0].uid,
          this.dataFrom.value.name,
          this.dataFrom.value.email,
          this.dataFrom.value.birthdate,
          this.dataFrom.value.phone,
          this.dataFrom.value.emergency
        );
        this.drs.updateSessionUser(_sess, this.drs.authUsers.value[0].uid, this.session.uid);
      }
      this.dismiss();
    } catch (error) {
      this.notification.showToast(error.message);
    }
  }
  dismiss() {
    this.modalController.dismiss();
  }
  //MARK JOIN TEAM LEAVE TEAM
  joinTeam() {}

  leaveTeam() {}
}
