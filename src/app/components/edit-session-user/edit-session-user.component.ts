import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import {
  joinableMembership,
  sessionMembership,
  SessionUserData,
} from 'src/app/classes/session-user-data';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { MembershipsService } from 'src/app/services/memberships.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-edit-session-user',
  templateUrl: './edit-session-user.component.html',
  styleUrls: ['./edit-session-user.component.scss'],
})
export class EditSessionUserComponent implements OnInit {
  @Input() session: SessionUserData = new SessionUserData('', '', '', '', '', '', '', {
    jsId: '',
    ahvNumber: '',
    ownsGA: false,
  });
  @Input() newSession: Boolean = false;

  dataFrom: FormGroup = this.fb.group({
    name: [''],
    surname: [''],
    email: [''],
    birthdate: [''],
    phone: [''],
    emergency: [''],
    jsnumber: ['JS-'],
    ahvnumber: ['756.', []],
  });

  joinForm: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(10)]],
  });

  memberships: sessionMembership[] = [];
  joinableMembership: joinableMembership | undefined;

  constructor(
    private modalController: ModalController,
    public drs: DataRepositoryService,
    public mss: MembershipsService,
    private fb: FormBuilder,
    private ns: NotificationService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    console.log(this.session, this.newSession);
    if (this.newSession) {
      this.session = new SessionUserData('', this.drs.authUsers.value[0].uid, '', '', '', '', '', {
        jsId: '',
        ahvNumber: '',
        ownsGA: false,
      });
    } else {
      this.dataFrom = this.fb.group({
        name: [
          `${this.session.name.split(' ')[1] || ''} ${this.session.name.split(' ')[2] || ''}` || '',
          Validators.required,
        ],
        surname: [this.session.name.split(' ')[0] || '', Validators.required],
        email: [this.session.email || '', Validators.required],
        birthdate: [this.session.birthdate || '', Validators.required],
        phone: [this.session.phoneNumber || '', Validators.required],
        emergency: [this.session.emergencyContact || '', Validators.required],
        jsnumber: [this.session.otherData.jsId],
        ahvnumber: [this.session.otherData.ahvNumber, []],
      });
    }
    this.init();
  }
  async init() {
    this.memberships = await this.drs.syncSessionMemberships(this.session.uid);

    this.joinableMembership = await this.drs.syncSessionJoinCode(this.session.owner);
  }
  saveAndDismiss() {
    try {
      if (this.newSession) {
        this.session = new SessionUserData(
          '',
          this.drs.authUsers.value[0].uid,
          `${this.dataFrom.value.surname} ${this.dataFrom.value.name}`,
          this.dataFrom.value.email,
          this.dataFrom.value.birthdate,
          this.dataFrom.value.phone,
          this.dataFrom.value.emergency,
          { jsId: '', ahvNumber: '', ownsGA: false },
          `https://avatars.dicebear.com/api/initials/${this.dataFrom.value.surname} ${this.dataFrom.value.name}.svg`
        );
        this.drs.createSessionUser(this.session, this.drs.authUsers.value[0].uid);
      } else {
        let _sess = new SessionUserData(
          '',
          this.drs.authUsers.value[0].uid,
          `${this.dataFrom.value.surname} ${this.dataFrom.value.name}`,
          this.dataFrom.value.email,
          this.dataFrom.value.birthdate,
          this.dataFrom.value.phone,
          this.dataFrom.value.emergency,
          {
            jsId: this.dataFrom.value.jsnumber,
            ahvNumber: this.dataFrom.value.ahvnumber,
            ownsGA: false,
          },
          this.session.profilePictureUrl
        );
        this.drs.updateSessionUser(_sess, this.drs.authUsers.value[0].uid, this.session.uid);
      }
      this.ns.requestPushPermission();
      this.ns.registerPushNotifications(this.drs.authUsers.value[0].uid);
      this.dismiss();
    } catch (error) {
      this.ns.showToast(error.message);
    }
  }
  dismiss() {
    this.modalController.dismiss();
  }
  //MARK JOIN TEAM LEAVE TEAM
  async joinTeam(code?: string) {
    // confirm dialog
    const _code = code || this.joinForm.value.code.trim();

    const alert = await this.alertController.create({
      header: 'Datenweitergabe erlauben',
      message:
        'Bitte bestätige, dass wir deine Daten an die Trainer des Teams weitergeben dürfen. (z.B. Name, Kontaktdaten, Notfallkontakt, AHV-Nummer, etc.)',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.ns.showToast(
              'Abgebrochen - Datenweitergabe benötigt. Kontaktiere deinen Administartor bei Fragen.'
            );
          },
        },
        {
          text: 'Einverstanden',
          handler: () => {
            this.joinForm.reset();
            this.mss
              .joinUsingCode(_code, this.session.uid, this.session.name)
              .then(() => {
                this.ns.showToast('Team beigetreten');
                this.init();
              })
              .catch((error) => {
                this.ns.showToast(
                  error.message || 'Team konnte nicht beigetreten werden. Stimmt der Code?'
                );
              });
          },
        },
      ],
    });

    await alert.present();
  }

  leaveTeam(membership: sessionMembership) {
    this.mss
      .leaveFromTeam(this.session.uid, membership.teamId, membership.clubId)
      .then(() => {
        this.ns.showToast('Team verlassen');
        this.init();
      })
      .catch((error) => {
        this.ns.showToast(error.message);
      });
  }

  async photoUrlChanged(event: any) {
    console.log(event);
    await new Promise((resolve) => setTimeout(resolve, 4000));
    this.session.profilePictureUrl = event.url;
  }
  async joinInvitation() {
    const code = this.joinableMembership?.code;
    if (code) {
      this.joinTeam(code);
      let user = this.drs.authUsers.value[0];
      user.joinCode = undefined;
      this.drs.updateAuthUser(user, user.uid);
    }
  }
}

/**
 * REGEX for validation of AHV numbers:
 * /[7][5][6][.][\d]{4}[.][\d]{4}[.][\d]{2}$/
 *
 * Sample valid AHV numbers:
 * 756.9217.0769.85
 * 756.1111.1111.13
 *
 * Sample invalid AHV numbers:
 * 111.1111.1111.11
 *
 * AHV numbers follow EAN-13 standard for checksum calculation:
 * https://de.wikipedia.org/wiki/EAN-13
 *
 */

export function ahvNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ahv = control.value;
    let regex = /[7][5][6][.][\d]{4}[.][\d]{4}[.][\d]{2}$/;
    let isValid = false;

    //Last digit of the entered number
    let checknumber = parseInt(ahv[ahv.length - 1]);

    //Validate the general setup of the insurance-number using the regex defined above
    isValid = regex.test(ahv);
    if (isValid)
      return {
        invalidAHV: { value: control.value, stage: 'format' },
      };
    //Remove last character (not needed to calculate checksum)
    let tmp_number = ahv.slice(0, ahv.length);
    //Remove dots from number and reverse it
    //(if you want to know why, look at the rules in the link given in the html-comment)
    tmp_number = tmp_number.split('.').join('').split('').reverse().join('');
    let sum = 0;
    for (let i = 0; i < tmp_number.length; i++) {
      var add = i % 2 == 0 ? Number(tmp_number[i]) * 3 : Number(tmp_number[i]) * 1;
      sum += add;
    }

    //Calculate correct checksum (again, see the documentation to undestand why)
    let checksum = Math.ceil(sum / 10) * 10 - sum;
    if (checksum !== checknumber) {
      isValid = false;
    }

    if (isValid) return null;
    return {
      invalidAHV: { value: control.value, stage: 'checksum' },
    };
  };
}
