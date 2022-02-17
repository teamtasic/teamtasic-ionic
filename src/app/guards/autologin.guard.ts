import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, CanLoad, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { filter, take, map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import { LogService } from '../services/log-service.service';

@Injectable({
  providedIn: 'root',
})
export class AutologinGuard implements CanLoad, CanActivate {
  constructor(
    private afs: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private logger: LogService
  ) {}
  canLoad(): Observable<boolean> | boolean {
    return this.afs.user.pipe(
      map((user) => {
        this.logger.debug('GUARD:', this.route.snapshot.queryParams.joining, user);
        if (this.route.snapshot.queryParams.joining) {
          this.logger.debug('GUARD:', 'joining');
          this.location.back();
          return false;
        } else if (user) {
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
    return true;
  }
}
