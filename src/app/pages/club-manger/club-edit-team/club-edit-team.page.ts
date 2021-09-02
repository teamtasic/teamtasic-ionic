import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
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
    public actionSheetController: ActionSheetController,
    public alertController: AlertController
  ) {
    if (this.drs.syncedClubs.size == 0) {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  editGroup: FormGroup;
  addGroup: FormGroup;

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

    this.addGroup = this.fb.group({
      uid: ['', [Validators.required]],
      aname: ['', [Validators.required]],
      asCoach: [false],
    });

    this.members = this.drs.syncedClubs
      .get(this.clubId)
      .clubData.teams.get(this.teamId).teamData.roles;

    this.editGroup.valueChanges.subscribe((data) => {
      this.hasChanges = true;
    });
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
          handler: this.removeMember.bind(this, userId),
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
          text: 'Rename member',
          icon: 'create-outline',
          handler: this.renameUser.bind(this, userId),
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

  removeMember(userId: string) {
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

  async renameUser(userId: string) {
    const alert = await this.alertController.create({
      header: 'Rename user ' + this.members[userId].name,
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'new name',
          value: this.members[userId].name,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Canceled');
          },
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('renaming');
          },
        },
      ],
    });

    await alert.present();
    const namingData = await alert.onDidDismiss();
    if (namingData.data.values.name1) {
      this.hasChanges = true;
      this.members[userId].name = namingData.data.values.name1;
    }
  }

  async addMember() {
    this.members[this.addGroup.value.uid] = {
      name: this.addGroup.value.aname,
      role: this.addGroup.value.asCoach ? 'trainer' : 'athlete',
    };
    this.hasChanges = true;
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

  resetChanges() {
    console.log('reset');
    this.hasChanges = false;
    this.ngOnInit();
  }
}
