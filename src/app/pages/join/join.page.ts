import { Component, OnInit } from '@angular/core';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';
import { AlertController, IonicSlides, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { take } from 'rxjs/operators';
import { EditSessionUserComponent } from 'src/app/components/edit-session-user/edit-session-user.component';
import { SessionUserData } from 'src/app/classes/session-user-data';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MembershipsService } from 'src/app/services/memberships.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

SwiperCore.use([Keyboard, Pagination, Scrollbar]);
@Component({
  selector: 'app-join',
  templateUrl: './join.page.html',
  styleUrls: ['./join.page.scss'],
})
export class JoinPage implements OnInit {
  constructor(
    public afs: AngularFireAuth,
    public drs: DataRepositoryService,
    private auth: AuthService,
    private modalController: ModalController,
    private ns: NotificationService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private mss: MembershipsService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  sessionSelectionForm: FormGroup = this.fb.group({
    sessions: this.fb.array([]),
  });

  ngOnInit() {
    try {
      this.drs.syncSessionUsers(this.drs.authUsers.getValue()[0].uid);
    } catch (e) {
      console.log(e);
    }
    this.drs.authUsers.subscribe((users) => {
      if (users.length > 0) {
        console.log('user', users[0]);
        this.drs.syncSessionUsers(users[0].uid);
      }
    });
    this.drs.sessionUsers.subscribe((_users) => {
      let users = _users[0];
      if (users?.length > 0) {
        this.sessionSelectionForm = this.fb.group({
          sessions: this.fb.array(users.map((user) => new FormControl(false))),
        });
      }
      console.log(this.sessionSelectionForm);
    });
    this.sessionSelectionForm.controls['sessions'].valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  // UI Actions
  async openSessenEditorNew() {
    const modal = await this.modalController.create({
      component: EditSessionUserComponent,
      swipeToClose: true,
      componentProps: {
        newSession: true,
      },
    });
    await modal.present();
  }

  async joinTeams() {
    // confirm dialog
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
          handler: async () => {
            try {
              for (const [index, user] of this.drs.sessionUsers.getValue()[0].entries()) {
                if (this.sessionSelectionForm.controls['sessions'].value[index]) {
                  console.log(user);
                  await this.mss.joinUsingCode(
                    this.route.snapshot.params['joinCode'],
                    user.uid,
                    user.name
                  );
                }
              }

              // this.drs.sessionUsers.value[0].forEach(async (user, index) => {

              // });
            } catch (e) {
              this.ns.showToast(
                e.message || 'Team konnte nicht beigetreten werden. Stimmt der Code?'
              );
              console.log(e);
            } finally {
              this.ns.showToast('Team beigetreten');
              this.router.navigate(['/tabs/tab2']);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
