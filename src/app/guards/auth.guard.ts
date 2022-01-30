import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, filter, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private afs: AngularFireAuth, private router: Router) {}
  canLoad(): Observable<boolean> | boolean {
    return this.afs.user.pipe(
      map((user) => {
        console.log('GUARD:', user);
        if (user) {
          return true;
        } else {
          this.router.navigateByUrl('/login');
          return false;
        }
      })
    );
    // return true;
  }
  canActivate(): Observable<boolean> | boolean {
    // return this.auth.isAuthenticated.pipe(
    //   // prettier-ignore
    //   filter(val => val !== null),
    //   take(1),
    //   map((isAuthenitcated, i) => {
    //     console.log('GUARD:', isAuthenitcated);
    //     console.log('INDEX: ', i);
    //     if (!isAuthenitcated) {
    //       this.router.navigateByUrl('/login');
    //     }
    //     return isAuthenitcated;
    //   })
    // );
    return true;
  }
}
