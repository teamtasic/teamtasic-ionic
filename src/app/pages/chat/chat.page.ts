import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { ActionSheetController, IonContent, ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { sessionMembership } from 'src/app/classes/session-user-data';
import { Team } from 'src/app/classes/team';
import { MeetCreateComponent } from 'src/app/components/meet-create/meet-create.component';
import { TrainingDetailViewComponent } from 'src/app/components/training-detail-view/training-detail-view.component';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { LogService } from 'src/app/services/log-service.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  today: string = new Date(Date.now()).toISOString();

  Array = Array;

  teamId: string = '';
  clubId: string = '';
  sessionId: string = '';

  meets: Meet[] = [];
  origMeets: Meet[] = [];
  team: Team | undefined;

  selectedSessionId: string = '';
  memberships: sessionMembership[] = [];

  sessionUserString: string = '';

  showTrainerCtrls: boolean = false;

  gridMode = false;

  sortedUsers: string[] = [];
  lastTrainerIndex: number = 0;

  loading = false;

  /**
   * Filter mode
   * 0: only future
   * 1: all
   * 2: only past
   * @type {(0 | 1 | 2)}
   * @memberof ChatPage
   */
  filterMode: 0 | 1 | 2 = 0;

  constructor(
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private fb: FormBuilder,
    public drs: DataRepositoryService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private logger: LogService
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

      this.sortedUsers = [];
      this.sortedUsers.push(this.sessionId);
      this.team?.trainers.forEach((trainerId) => {
        if (!this.team?.hiddenMembers.includes(trainerId)) {
          this.sortedUsers.push(trainerId);
        }
      });
      this.lastTrainerIndex = this.sortedUsers.length - 1;
      this.team?.users.forEach((userId) => {
        if (!this.team?.hiddenMembers.includes(userId)) {
          if (!this.team?.trainers.includes(userId)) {
            this.sortedUsers.push(userId);
          }
        }
      });
    });

    this.drs.syncMeetsForTeam(this.teamId, this.clubId).subscribe((meets) => {
      this.origMeets = meets;
      this.init(meets);
    });

    this.drs.authUsers.subscribe(async (users) => {
      if (users.length > 0) {
        const sessions = await this.drs.syncSessionUsers(users[0].uid);
      }
    });
    this.drs.sessionUsers.subscribe((sessionUsers) => {
      this.logger.debug(sessionUsers, 'sessions');
      this.sessionUserString = sessionUsers[0].find((s) => s.uid === this.sessionId)?.name || '';
    });
  }
  init(meets: Meet[]) {
    this.loading = true;
    this.logger.debug(meets, 'sorting...');
    let m = meets;
    m.sort((a, b) => {
      return (a.start as any) - (b.start as any);
    });
    // filter out meets starting in the past
    if (this.filterMode === 0) {
      m = m.filter((meet) => {
        return (meet.start as any) > Date.now() - 1000 * 60 * 30;
      });
    } else if (this.filterMode === 2) {
      m = m.filter((meet) => {
        return (meet.start as any) < Date.now() - 1000 * 60 * 30;
      });
    }

    m.forEach((meet) => {
      this.drs.syncMeet(meet.uid, this.clubId, this.teamId);
    });
    this.meets = m;
    new Promise((resolve) => setTimeout(resolve, 200)).then(() => {
      this.loading = false;
    });
  }

  async addTraining() {
    const modal = await this.modalController.create({
      component: MeetCreateComponent,
      componentProps: {
        sessionId: this.sessionId,
        teamId: this.teamId,
        clubId: this.clubId,
      },
    });
    await modal.present();
  }
  toggleGrid() {
    this.gridMode = !this.gridMode;
  }
  get gridAvailable() {
    return true;
  }
  async presentModal(meet: Meet) {
    const modal = await this.modalController.create({
      component: TrainingDetailViewComponent,
      componentProps: {
        meet: meet,
        sessionId: this.sessionId,
        teamId: this.teamId,
        clubId: this.clubId,
      },
    });

    await modal.present();
  }

  async setFilterMode() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter',
      buttons: [
        {
          text: 'Zukünftige Termine',
          icon: 'play-forward-outline',
          role: this.filterMode === 0 ? 'selected' : '',
          handler: () => {
            this.filterMode = 0;
          },
        },
        {
          text: 'Vergangene Termine',
          icon: 'play-back-outline',
          role: this.filterMode === 2 ? 'selected' : '',
          handler: () => {
            this.filterMode = 2;
          },
        },
        {
          text: 'Alle',
          icon: 'apps-outline',
          role: this.filterMode === 1 ? 'selected' : '',
          handler: () => {
            this.filterMode = 1;
          },
        },
      ],
    });
    await actionSheet.present();

    await actionSheet.onDidDismiss();
    this.init(this.origMeets);
  }
}
