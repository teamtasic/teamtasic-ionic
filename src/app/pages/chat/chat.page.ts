import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { sessionMembership } from 'src/app/classes/session-user-data';
import { Team } from 'src/app/classes/team';
import { MeetCreateComponent } from 'src/app/components/meet-create/meet-create.component';
import { TrainingDetailViewComponent } from 'src/app/components/training-detail-view/training-detail-view.component';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {
  today: string = new Date(Date.now()).toISOString();

  teamId: string;
  clubId: string;
  sessionId: string;

  meets: Meet[] = [];
  team: Team;

  selectedSessionId: string;
  memberships: sessionMembership[] = [];

  @ViewChild(IonContent) content: IonContent;

  constructor(
    public modalController: ModalController,
    private fb: FormBuilder,
    public drs: DataRepositoryService,
    public activatedRoute: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.teamId = params.get('teamId');
      this.clubId = params.get('clubId');
      this.sessionId = params.get('sessionId');
    });

    this.drs.syncTeam(this.teamId, this.clubId);
    this.drs.teams.subscribe((teams) => {
      this.team = teams.find((t) => t.uid === this.teamId);
    });

    this.drs.syncMeetsForTeam(this.teamId, this.clubId).subscribe((meets) => {
      console.log(meets, 'sorting...');
      let m = meets;
      m.sort((a, b) => {
        return (a.start as any) - (b.start as any);
      });
      console.log(m);
      this.meets = m;
    });

    this.drs.authUsers.subscribe(async (users) => {
      if (users.length > 0) {
        this.drs.syncSessionUsers(users[0].uid);
      }
    });
  }
  ngAfterViewInit() {
    this.content.scrollToBottom(300);
  }

  async addTraining() {
    const modal = await this.modalController.create({
      component: MeetCreateComponent,
      componentProps: {
        teamId: this.teamId,
        clubId: this.clubId,
      },
    });
    await modal.present();
  }

  async sessionChanged(event: any) {
    this.selectedSessionId = event.detail.value;
    this.memberships = await this.drs.syncSessionMemberships(this.selectedSessionId);
  }
}
