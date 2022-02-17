import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AdminData, AuthUserData } from '../classes/auth-user-data';
import { SessionUserData } from '../classes/session-user-data';
import { DataRepositoryService } from './data-repository.service';
import { LogService } from './log-service.service';

@Injectable({
  providedIn: 'root',
})
export class LogicService {
  constructor(private drs: DataRepositoryService, private logger: LogService) {}

  public adminData: AdminData = new AdminData([]);

  private _userId: string = '';
  get userId(): string {
    return this._userId;
  }
  set userId(id: string) {
    if (this._userId == undefined || this._userId == '') {
      this._userId = id;
      // return;
    }
  }
  logout() {
    this._userId = '';
  }

  async startSession() {
    this.logger.info('[ 🏃🏻‍♂️ startSession ]');
    await this.drs.syncAuthUser(this._userId);
    this.drs.syncSessionUsers(this._userId);
    this.logger.debug(this.drs.authUsers.value);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.syncAdminSession();

    this.logger.info('[ 🏃🏻‍♂️ startSession ]', 'done for user', this._userId);
  }

  async syncAdminSession() {
    this.adminData = new AdminData([]);
    this.drs.getClubsForAdmin(this._userId).then((clubs) => {
      this.logger.info('[ 🔄 syncAdminSession ]', 'clubs', clubs);
      if (clubs) {
        this.adminData = new AdminData(clubs);

        clubs.forEach((club) => {
          this.drs.syncClub(club);
          this.drs.getTeamsForClub(club);
        });
      }
    });
  }
}
