import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { sessionMembership, SessionUserData } from 'src/app/classes/session-user-data';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { MembershipsService } from 'src/app/services/memberships.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  constructor(
    public drs: DataRepositoryService,
    private mms: MembershipsService,
    public router: Router
  ) {}

  selectedSessionId: string;

  memberships: sessionMembership[] = [];

  async sessionChanged(event: any) {
    this.selectedSessionId = event.detail.value;

    this.memberships = await this.drs.syncSessionMemberships(this.selectedSessionId);
    if (this.memberships.length == 1) {
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
  }
  ngOnInit() {
    this.drs.authUsers.subscribe(async (users) => {
      if (users.length > 0) {
        this.drs.syncSessionUsers(users[0].uid);
      }
    });
  }
  getClubName(clubId: string) {
    try {
      return this.drs.clubs.getValue().find((c) => c.uid == clubId).name;
    } catch {
      return '';
    }
  }
}
