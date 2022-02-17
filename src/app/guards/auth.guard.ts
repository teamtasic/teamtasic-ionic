import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, filter, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { LogService } from '../services/log-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private afs: AngularFireAuth, private router: Router, private logger: LogService) {}
  canLoad(): Observable<boolean> | boolean {
    return this.afs.user.pipe(
      map((user) => {
        this.logger.info('[ GUARD ]', user);
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
    return true;
  }
}
