import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';
import { DataRepositoryService } from './data-repository.service';
import { LogicService } from './logic.service';
import { NotificationService } from './notification-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async createUser(
    email: string,
    pw: string,
    username: string,
    phoneNumber: string,
    address: string,
    zip: string
  ) {
    await this.fba
      .createUserWithEmailAndPassword(email, pw)
      .then(async (userCredential) => {
        var user = userCredential.user;
        if (user) {
          user.sendEmailVerification();
        }
        let userData = new AuthUserData('', username, email, phoneNumber, address, zip, {
          enabled: false,
          newTrainingNotifications: true,
          trainingChangedNotifications: true,
          trainingReminderNotifications: true,
        });
        await this.drs.createAuthUser(userData, user.uid);
        // alert succesfull signup
        const alert = await this.alertController.create({
          header: 'Erfloglreich registriert',
          subHeader: 'Wir haben dir eine Email gesendet, überprüfe deinen SPAM-Ordner',
          buttons: ['Ok'],
        });
        await alert.present();

        await alert.onDidDismiss();
      })
      .catch((error) => {
        console.warn('[ 🔑 createUser ]', 'createUser failed.');
        return error;
      });
  }

  async login(user, pw) {
    console.log('[ 🔑 login ]', 'Signing in with email and password');
    this.fba
      .signInWithEmailAndPassword(user, pw)
      .then(async (user) => {
        console.log('[ 🔑 login ]', 'User logged in:', user.user.uid);
        return { state: true, error: '' };
      })
      .catch((error) => {
        var errorCode = error.code;
        this.ns.showToast(`Fehler: ${errorCode}`);
        console.error('[ 🔑 login ]', 'authentication failed:', error);
        return { state: false, error: errorCode };
      });
  }
  async logout() {
    await this.fba.signOut();
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fba: AngularFireAuth,
    private drs: DataRepositoryService,
    public alertController: AlertController,
    private ng: NgZone,
    public ns: NotificationService,
    private logic: LogicService
  ) {
    this.fba.onAuthStateChanged(async (user) => {
      console.log('[ 🔑 AuthService ]', 'AuthStateChanged:', user);
      if (user) {
        console.log('[ 🔑 login ]', 'Signed in succsessfully, starting session');
        this.logic.userId = user.uid;
        this.ns.registerPushNotifications(user.uid);
        ng.run(() => {
          this.router.navigateByUrl('/tabs/tab2');
        });
        await this.logic.startSession();
      } else {
        ng.run(() => {
          this.router.navigateByUrl('/', { replaceUrl: true });
        });
      }
    });
  }

  async resetPassword(email: string) {
    await this.fba.sendPasswordResetEmail(email);
  }

  async updateEmail() {
    const email = await this.ns.promptForNewEmail();
    if (email) {
      const user = await this.fba.currentUser;
      try {
        await user.updateEmail(email);
        this.ns.showToast('Email wurde erfolgreich geändert');
      } catch (error) {
        this.ns.showToast(`Fehler: ${error.message}`);
      }
    }
  }
}
