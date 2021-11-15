import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthUserData } from '../classes/auth-user-data';
import { SessionUserData } from '../classes/session-user-data';
import { DataRepositoryService } from './data-repository.service';

@Injectable({
  providedIn: 'root',
})
export class LogicService {
  constructor(private drs: DataRepositoryService) {
    this.currentUser = this.drs.authUsers.pipe(
      map((users) => {
        if (this._userId != undefined) {
          return users.find((user) => user.uid == this._userId);
        }
        return undefined;
      })
    ) as BehaviorSubject<AuthUserData>;

    this.drs.sessionUsers.pipe(
      map((users) => {
        if (this._userId != undefined) {
          return users.find((user) => user[0].owner == this._userId);
        }
        return undefined;
      })
    ) as BehaviorSubject<SessionUserData[]>;
  }

  public currentUser: BehaviorSubject<AuthUserData> = new BehaviorSubject(null);
  public sessionUsers: BehaviorSubject<SessionUserData[]> = new BehaviorSubject([]);
  private _userId: string;
  get userId(): string {
    return this._userId;
  }
  set userId(id: string) {
    if (this._userId == undefined) {
      this._userId = id;
      // return;
    }
    console.warn('userId already set');
  }
  logout() {
    this._userId = undefined;
  }

  startSession() {
    console.log('[ 🏃🏻‍♂️ startSession ]');
    this.drs.syncAuthUser(this._userId);
    this.drs.syncSessionUsers(this._userId);

    console.log('[ 🏃🏻‍♂️ startSession ]', 'done for user', this._userId);
  }
}
