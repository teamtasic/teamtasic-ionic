import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-club-edit-team',
  templateUrl: './club-edit-team.page.html',
  styleUrls: ['./club-edit-team.page.scss'],
})
export class ClubEditTeamPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private drs: DataRepositoryService,
    public actionSheetController: ActionSheetController
  ) {}

  editGroup: FormGroup;

  clubId: string;
  teamId: string;

  members: Object;

  hasChanges: boolean;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
      this.teamId = params.get('teamId');
    });

    this.editGroup = this.fb.group({
      name: [
        this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).name,
        [Validators.required],
      ],
    });

    // for (let member in this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId)
    //   .teamData.roles) {
    //   this.members.push(
    //     this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).teamData.roles[member]
    //   );
    //   this.members[this.members.length - 1]['id'] = member;
    // }

    this.members = this.drs.syncedClubs
      .get(this.clubId)
      .clubData.teams.get(this.teamId).teamData.roles;
  }

  async presentActionSheet(userId: string) {
    console.log('present');
    const actionSheet = await this.actionSheetController.create({
      header: this.members[userId].name,
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          icon: 'trash',
          handler: this.romoveMember.bind(this, userId),
        },
        {
          text: 'Make trainer',
          icon: 'person-add-outline',
          handler: this.makeTrainer.bind(this, userId),
        },
        {
          text: 'Make athlete',
          icon: 'person-remove-outline',
          handler: this.makeAthlete.bind(this, userId),
        },
        {
          text: 'See user',
          icon: 'list-outline',
          handler: this.seeUser.bind(this, userId),
        },

        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss();
    console.log(this.members);
  }

  romoveMember(userId: string) {
    this.hasChanges = true;
    console.log('remove');
    if (this.members[userId].role != 'owner') {
      delete this.members[userId];
    }
  }
  makeTrainer(userId: string) {
    this.hasChanges = true;
    console.log('make trainer');
    if (this.members[userId].role != 'owner') this.members[userId].role = 'trainer';
  }
  makeAthlete(userId: string) {
    this.hasChanges = true;
    console.log('make athlete');
    if (this.members[userId].role != 'owner') this.members[userId].role = 'athlete';
  }
  seeUser(userId: string) {
    console.log('see user');
  }

  async saveChanges() {
    this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).teamData.roles =
      this.members;
    this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).name =
      this.editGroup.value.name;
    this.hasChanges = false;
    await this.drs.updateTeam(this.teamId, this.clubId);
    await this.drs.setTeamData(
      this.teamId,
      this.clubId,
      this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).teamData
    );
  }
}
