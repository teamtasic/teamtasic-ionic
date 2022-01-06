import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { sessionMembership } from 'src/app/classes/session-user-data';
import { Team } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-chat-archive',
  templateUrl: './chat-archive.page.html',
  styleUrls: ['./chat-archive.page.scss'],
})
export class ChatArchivePage implements OnInit {
  today: string = new Date(Date.now()).toISOString();

  teamId: string = '';
  clubId: string = '';
  sessionId: string = '';

  meets: Meet[] = [];
  team: Team | undefined;

  selectedSessionId: string = '';
  memberships: sessionMembership[] = [];

  sessionUserString: string = '';

  showTrainerCtrls: boolean = false;

  constructor(
    public modalController: ModalController,
    private fb: FormBuilder,
    public drs: DataRepositoryService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.teamId = params.get('teamId') || '';
      this.clubId = params.get('clubId') || '';
      this.sessionId = params.get('sessionId') || '';
    });

    this.drs.syncTeam(this.teamId, this.clubId);
    this.drs.teams.subscribe((teams) => {
      this.team = teams.find((t) => t.uid === this.teamId);
      this.showTrainerCtrls = this.team?.trainers.includes(this.sessionId) || false;
    });

    this.drs.syncMeetsForTeam(this.teamId, this.clubId).subscribe((meets) => {
      let m = meets;
      m.sort((a, b) => {
        return (a.start as any) - (b.start as any);
      });
      // // filter out meets starting in the past
      // m = m.filter((meet) => {
      //   return (meet.start as any) > Date.now() - 1000 * 60 * 30;
      // });
      m.forEach((meet) => {
        this.drs.syncMeet(meet.uid, this.clubId, this.teamId);
      });
      this.meets = m;
    });

    this.drs.authUsers.subscribe(async (users) => {
      if (users.length > 0) {
        const sessions = await this.drs.syncSessionUsers(users[0].uid);
      }
    });
    this.drs.sessionUsers.subscribe((sessionUsers) => {
      console.log(sessionUsers, 'sessions');
      this.sessionUserString = sessionUsers[0].find((s) => s.uid === this.sessionId)?.name || '';
    });
  }
}
