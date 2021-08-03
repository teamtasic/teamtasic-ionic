import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';
import { DataRepositoryService } from './data-repository.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  async createUser(email: string, pw: string, username: string) {
    await this.fba
      .createUserWithEmailAndPassword(email, pw)
      .then(async (userCredential) => {
        var user = userCredential.user;
        if (user) {
          this.drs.addUser(new AuthUserData(user.uid, null, username, email, []));
        }

        // alert succesfull signup
        const alert = await this.alertController.create({
          header: 'Signup succesfull',
          subHeader: 'You can now login',
          buttons: ['OK']
        });
        await alert.present();

        await alert.onDidDismiss().then(() => {
          this.router.navigateByUrl('/login', { replaceUrl: true });
        });

      }).catch((error) => {
        console.error('[ 🔑 createUser ]', 'createUser failed.');
        return error;
      });
  }
  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async login(user, pw) {
    console.log('Email sign in');
    this.fba
      .signInWithEmailAndPassword(user, pw)
      .then(async (user) => {
        let userData = await this.drs.getUserData(user.user.uid);
        this.drs.currentUser.next(userData);
        console.log('[ 🔑 login ]','Signed in succsessfully.');
        this.isAuthenticated.next(true);
        return { state: true, error: '' };
      })
      .catch((error) => {
        var errorCode = error.code;
        this.isAuthenticated.next(false);
        console.error('[ 🔑 login ]','authentication failed.');
        return { state: false, error: errorCode };
      });
  }
  async logout() {
    await this.fba.signOut();
    this.isAuthenticated.next(false);
  }
  constructor(
    private router: Router,
    private fba: AngularFireAuth,
    private drs: DataRepositoryService,
    public alertController: AlertController
  ) {
    this.isAuthenticated.subscribe((data) => {
      if (data == true) {
        this.router.navigateByUrl('/tabs');
      } else {
        this.router.navigateByUrl('/login', {replaceUrl: true});
      }
    }, (err) => {
      console.error('[ 🔑 AuthService ]', 'Error in AuthService:');
    });
  }
}
