import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { Team } from 'src/app/classes/team';
import { SessionUserViewComponent } from 'src/app/components/session-user-view/session-user-view.component';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-addressbook',
  templateUrl: './addressbook.page.html',
  styleUrls: ['./addressbook.page.scss'],
})
export class AddressbookPage implements OnInit {
  teamId: string;
  clubId: string;
  sessionId: string;

  meets: Meet[] = [];
  team: Team;
  elementsToDisplay = [];

  constructor(
    public drs: DataRepositoryService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private modalController: ModalController
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
      this.team.users.forEach((user) => {
        this.elementsToDisplay.push([user, this.team.names[user]]);
      });
    });
  }

  async queryChanged(event) {
    this.elementsToDisplay = [];
    this.team.users.forEach((user) => {
      if (this.team.names[user].toLowerCase().includes(event.detail.value.toLowerCase())) {
        this.elementsToDisplay.push([user, this.team.names[user]]);
      }
    });
  }
  async openModal(userId: string) {
    const modal = await this.modalController.create({
      component: SessionUserViewComponent,
      componentProps: {
        userId: userId,
      },
    });
    return await modal.present();
  }
}
