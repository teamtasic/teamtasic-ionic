import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';
import { DataRepositoryService } from './data-repository.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  async createUser(email: string, pw: string, username: string) {
    await this.fba
      .createUserWithEmailAndPassword(email, pw)
      .then(async (userCredential) => {
        var user = userCredential.user;
        if (user) {
          this.drs.addUser(new AuthUserData(user.uid, null, username, email, []));
          user.sendEmailVerification();
        }

        // alert succesfull signup
        const alert = await this.alertController.create({
          header: 'Erfloglreich registriert',
          subHeader: 'Wir haben dir eine Email gesendet, überprüfe deinen SPAM-Ordner',
          buttons: ['Zum login'],
        });
        await alert.present();

        await alert.onDidDismiss().then(() => {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        });
      })
      .catch((error) => {
        console.error('[ 🔑 createUser ]', 'createUser failed.');
        return error;
      });
  }
  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    private ng: NgZone
  ) {
    this.fba.onAuthStateChanged(async (user) => {
      console.log('[ 🔑 AuthService ]', 'AuthStateChanged:', user);
      if (user) {
        let userData = await this.drs.getUserData(user.uid);
        console.log('[ 🔑 login ]', 'Signed in succsessfully, preparing session kickstart');
        console.log(userData as Object);
        this.drs.currentUser.next(userData);
        ng.run(() => {
          this.router.navigateByUrl('/tabs');
        });
        await this.drs.kickstartPostLogin();
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
}
