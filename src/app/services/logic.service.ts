import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AdminData, AuthUserData } from '../classes/auth-user-data';
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
  public adminData: AdminData = new AdminData([]);

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

  async startSession() {
    console.log('[ 🏃🏻‍♂️ startSession ]');
    this.drs.syncAuthUser(this._userId);
    this.drs.syncSessionUsers(this._userId);

    this.syncAdminSession();

    console.log('[ 🏃🏻‍♂️ startSession ]', 'done for user', this._userId);
  }

  async syncAdminSession() {
    this.adminData = new AdminData([]);
    this.drs.getClubsForAdmin(this._userId).then((clubs) => {
      console.log('[ 🔄 syncAdminSession ]', 'clubs', clubs);
      if (clubs) {
        this.adminData = new AdminData(clubs);

        clubs.forEach((club) => {
          this.drs.syncClub(club);
          this.drs.getTeamsForClub(club).then((teams) => {
            this.adminData.teamsByClub.set(club, teams);
            teams.forEach((team) => {
              this.drs.syncTeam(team, club);
            });
          });
        });
      }
    });
  }
}
