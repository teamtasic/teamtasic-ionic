import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { LogicService } from 'src/app/services/logic.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { EditSessionUserComponent } from 'src/app/components/edit-session-user/edit-session-user.component';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  constructor(
    public drs: DataRepositoryService,
    public logic: LogicService,
    public auth: AuthService,
    public fb: FormBuilder,
    public ns: NotificationService,
    private modalController: ModalController
  ) {}

  userData: FormGroup = this.fb.group({
    username: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required],
    zipcode: ['', Validators.required],
  });
  _userData: FormGroup = this.userData;

  async ngOnInit() {
    const modal = await this.modalController.create({
      component: EditSessionUserComponent,
      swipeToClose: true,
    });

    await modal.present();
  }
  async saveUserData() {
    let user = this.drs.authUsers.value[0];
    if (user) {
      try {
        user.username = this.username.value;
        user.phoneNumber = this.phoneNumber.value;
        user.address = this.address.value;
        user.zipcode = this.zipcode.value;
        await this.drs.updateAuthUser(user, this.drs.authUsers.value[0].uid);
        this.ns.showToast('Deine Daten wurden gespeichert.');
      } catch (error) {
        this.ns.showToast(`Fehler beim Speichern der Daten: ${error}`);
      }
    }
  }

  async changePassword() {
    await this.auth.resetPassword(this.drs.authUsers.value[0].email);
    this.ns.showToast('Eine E-Mail mit einem Link wurde an deine E-Mail Adresse gesendet.');
  }
  async changeEmail() {
    await this.auth.updateEmail();
  }
  async deleteAccount() {
    // await this.auth.deleteAccount();
    this.ns.showToast('Dein Account konnte nicht gelöscht werden. Fehler #29-AUTH-NO');
  }

  get username() {
    return this.userData.get('username');
  }
  get phoneNumber() {
    return this.userData.get('phoneNumber');
  }
  get address() {
    return this.userData.get('address');
  }
  get zipcode() {
    return this.userData.get('zipcode');
  }
}
