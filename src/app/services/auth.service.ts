import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DataRepositoryService } from './data-repository.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  async createUser(user: string, pw: string) {
    await this.fba
      .createUserWithEmailAndPassword(user, pw)
      .then((userCredential) => {
        var user = userCredential.user;
        if (user) {
          return user.uid;
        }
      });
  }
  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async login(user, pw) {
    console.log('Email sign in');
    await this.timeout(200);
    this.isAuthenticated.next(true);
    // this.fba
    //   .signInWithEmailAndPassword(user, pw)
    //   .then((user) => {
    //     console.log('Signed in succsessfully.');
    //     this.isAuthenticated.next(true);
    //     return { state: true, error: '' };
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     this.isAuthenticated.next(false);
    //     return { state: false, error: errorCode };
    //   });
  }
  async logout() {
    await this.fba.signOut();
    this.isAuthenticated.next(false);
    this.router.navigateByUrl('/login');
  }
  constructor(
    private router: Router,
    private fba: AngularFireAuth,
    private drs: DataRepositoryService
  ) {
    this.isAuthenticated.subscribe(console.log);
  }
}
