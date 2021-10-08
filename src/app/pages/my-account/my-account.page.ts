import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  constructor(
    public drs: DataRepositoryService,
    public auth: AuthService,
    public fb: FormBuilder,
    public ns: NotificationService
  ) {}

  userData: FormGroup = this.fb.group({
    username: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required],
    zipcode: ['', Validators.required],
  });
  _userData: FormGroup = this.userData;

  ngOnInit() {
    this.drs.currentUser.subscribe((user) => {
      if (user) {
        this.userData = this.fb.group({
          username: [user.username, Validators.required],
          phoneNumber: [user.phoneNumber, Validators.required],
          address: [user.address, Validators.required],
          zipcode: [user.zipcode, Validators.required],
        });
      }
    });
  }
  async saveUserData() {
    let user = await this.drs.currentUser.getValue();
    if (user) {
      try {
        user.username = this.username.value;
        user.phoneNumber = this.phoneNumber.value;
        user.address = this.address.value;
        user.zipcode = this.zipcode.value;
        this.drs.currentUser.next(user);
        await this.drs.updateUser();
        this.ns.showToast('Deine Daten wurden gespeichert.');
      } catch (error) {
        this.ns.showToast(`Fehler beim Speichern der Daten: ${error}`);
      }
    }
  }

  async copyUidToClipboard() {
    try {
      await Clipboard.write({ string: this.drs.currentUser.getValue().uid });
      this.ns.showToast('Benutzer Id wurde in die Zwischenablage kopiert.');
    } catch (error) {
      console.warn(error);
    }
  }
  async shareUid() {
    try {
      await Share.share({
        title: 'Meine Teamtasic User Id, füge mich deinem Team hinzu!',
        text: `Füge mich deinem Team hinzu, meine Teamtasic User Id ist ${
          this.drs.currentUser.getValue().uid
        }`,
        dialogTitle: 'Teile deine User Id mit deinem Administrator.',
      });
    } catch (error) {
      console.warn(error);
    }
  }
  async changePassword() {
    await this.auth.resetPassword(this.drs.currentUser.getValue().email);
    this.ns.showToast('Eine E-Mail mit einem Link wurde an deine E-Mail Adresse gesendet.');
  }
  async changeEmail() {
    await this.auth.updateEmail();
  }
  async deleteAccount() {
    // await this.auth.deleteAccount();
    this.ns.showToast(
      'Dein Account konnte nicht gelöscht werden. Bitte Verlasse zuerst alle Teams.'
    );
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
