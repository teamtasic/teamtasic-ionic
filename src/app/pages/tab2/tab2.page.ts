import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { sessionMembership, SessionUserData } from 'src/app/classes/session-user-data';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { MembershipsService } from 'src/app/services/memberships.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { VersionService } from 'src/app/services/version.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  selectedSession: SessionUserData | undefined;
  constructor(
    public drs: DataRepositoryService,
    public router: Router,
    private menu: MenuController,
    private versionService: VersionService,
    private ns: NotificationService
  ) {}

  selectedSessionId: string = '';

  memberships: sessionMembership[] = [];

  async sessionChanged(sessionId: string, navigateForSingle: boolean = true) {
    this.selectedSessionId = sessionId;

    this.memberships = await this.drs.syncSessionMemberships(this.selectedSessionId);
    if (this.memberships.length == 1 && navigateForSingle) {
      this.router.navigate([
        '/tabs/tab2/chat',
        this.selectedSessionId,
        this.memberships[0].clubId,
        this.memberships[0].teamId,
      ]);
    }
    this.memberships.forEach((m) => {
      this.drs.syncClub(m.clubId);
    });
    this.selectedSession = this.drs.sessionUsers.getValue()[0].find((s) => s.uid == sessionId);
    this.menu.close('menu');
  }
  ngOnInit() {
    this.drs.authUsers.subscribe(async (users) => {
      if (users.length > 0) {
        this.drs.syncSessionUsers(users[0].uid);
      }
    });
    this.drs.sessionUsers.pipe(take(2)).subscribe((sessions) => {
      if (sessions.length > 0) {
        this.selectedSession = sessions[0][0];
        this.selectedSessionId = this.selectedSession?.uid;
        this.sessionChanged(this.selectedSessionId, false);
      }
    });
    this.ns.requestPushPermission();
  }
  getClubName(clubId: string) {
    try {
      return this.drs.clubs.getValue().find((c) => c.uid == clubId)?.name;
    } catch {
      return '';
    }
  }
  openMenu() {
    this.menu.enable(true, 'menu');
    this.menu.open('menu');
  }
}
