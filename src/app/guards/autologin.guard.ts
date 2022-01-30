import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter, take, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AutologinGuard implements CanLoad, CanActivate {
  constructor(private afs: AngularFireAuth, private router: Router) {}
  canLoad(): Observable<boolean> | boolean {
    return this.afs.user.pipe(
      map((user) => {
        console.log('GUARD:', user);
        if (user) {
          this.router.navigateByUrl('/tabs');
          return false;
        } else {
          return true;
        }
      })
    );
    // return true;
  }
  canActivate(): Observable<boolean> | boolean {
    //   return this.auth.isAuthenticated.pipe(
    //     filter((val) => val !== null),
    //     take(1),
    //     map((isAuthenticated) => {
    //       console.log('GUARD: ', isAuthenticated);
    //       if (isAuthenticated) {
    //         this.router.navigateByUrl('/tabs', { replaceUrl: true });
    //         return false;
    //       } else {
    //         return true;
    //       }
    //     })
    //   );
    return true;
  }
}
