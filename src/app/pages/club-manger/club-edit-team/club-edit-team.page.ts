import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Team } from 'src/app/classes/team';
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
    public alertController: AlertController,
    public ns: NotificationService
  ) {}

  editGroup: FormGroup;
  addGroup: FormGroup;

  clubId: string;
  teamId: string;

  team: Team;
  roles: Object = {};
  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.clubId = params.get('clubId');
      this.teamId = params.get('teamId');
      this.team = this.drs.teams.value.find((t) => t.uid == this.teamId);
      this.teamChanged(this.team);
    });
    this.drs.teams.subscribe((teams) => {
      this.team = teams.find((t) => t.uid == this.teamId);
      this.teamChanged(this.team);
    });

    this.editGroup = this.fb.group({
      name: [
        this.drs.teams.value.find((team) => team.uid == this.teamId).name,
        [Validators.required],
      ],
    });
  }
  async teamChanged(team: Team) {
    team.users.forEach((userId) => {
      this.roles[userId] = 'athlete';
    });
    team.trainers.forEach((userId) => {
      this.roles[userId] = 'trainer';
    });
    team.headTrainers.forEach((userId) => {
      this.roles[userId] = 'headTrainer';
    });
    team.admins.forEach((userId) => {
      this.roles[userId] = 'admin';
    });
    console.log(this.roles);
  }

  async presentActionSheet(userId: string) {
    console.log('present');
    const actionSheet = await this.actionSheetController.create({
      header: this.team.names[userId].name,
      buttons: [
        {
          text: 'Entfernen',
          role: 'destructive',
          icon: 'trash',
          handler: this.removeMember.bind(this, userId),
        },
        // {
        //   text: 'Make trainer',
        //   icon: 'person-add-outline',
        //   handler: this.makeTrainer.bind(this, userId),
        // },
        // {
        //   text: 'Make athlete',
        //   icon: 'person-remove-outline',
        //   handler: this.makeAthlete.bind(this, userId),
        // },
        {
          text: 'Benutzer Umbenennen',
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
  }

  removeMember(userId: string) {
    console.log('remove', userId);
  }
  makeTrainer(userId: string) {
    console.log('make trainer', userId);
  }
  makeAthlete(userId: string) {
    console.log('make athlete', userId);
  }
  seeUser(userId: string) {
    console.log('see user');
  }

  async renameUser(userId: string) {
    const alert = await this.alertController.create({
      header: 'Rename user ' + this.team.names[userId],
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'new name',
          value: this.team.names[userId],
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
    }
  }

  // async addMember() {
  //   // check if user with uid exists with drs if data.uid is not empty
  //   if (this.addGroup.value.uid) {
  //     this.userState = 'loading';
  //     this.drs.userExists(this.addGroup.value.uid).then((res) => {
  //       this.userState = res ? 'verified' : 'none';
  //     });
  //     const origUserId = this.addGroup.value.uid;
  //     // fix behavior with user already existing with same auth id
  //     while (this.members[this.addGroup.value.uid]) {
  //       this.addGroup.value.uid = this.addGroup.value.uid + '-x';
  //     }

  //     this.members[this.addGroup.value.uid] = {
  //       name: this.addGroup.value.aname,
  //       role: this.addGroup.value.asCoach ? 'trainer' : 'athlete',
  //     };

  //     this.drs.createJoinRequest(
  //       this.teamId,
  //       this.clubId,
  //       this.addGroup.value.uid,
  //       origUserId,
  //       this.addGroup.value.aname,
  //       this.editGroup.value.name,
  //       this.addGroup.value.asCoach ? 'trainer' : 'athlete'
  //     );
  //     this.saveChanges();
  //     this.addGroup = this.fb.group({
  //       uid: [
  //         '',
  //         [Validators.required, Validators.minLength(6), Validators.pattern('/^[a-zA-Z0-9-_]+$/')],
  //       ],
  //       aname: ['', [Validators.required]],
  //       asCoach: [false],
  //     });
  //   } else {
  //     this.userState = 'none';
  //   }
  //   this.ns.showToast('Benutzer wurde hinzugefügt');
  // }

  // async saveChanges() {
  //   this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).teamData.roles =
  //     this.members;
  //   this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).name =
  //     this.editGroup.value.name;

  //   this.membersToRemove.forEach((userId) => {
  //     this.drs.createLeaveRequest(this.teamId, this.clubId, userId);
  //   });

  //   this.hasChanges = false;
  //   await this.drs.updateTeam(this.teamId, this.clubId);
  //   await this.drs.setTeamData(
  //     this.teamId,
  //     this.clubId,
  //     this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).teamData
  //   );
  //   this.addGroup = this.fb.group({
  //     uid: [
  //       '',
  //       [Validators.required, Validators.minLength(6), Validators.pattern('/^[a-zA-Z0-9-_]+$/')],
  //     ],
  //     aname: ['', [Validators.required]],
  //     asCoach: [false],
  //   });
  //   this.ns.showToast('Änderungen gespeichert');
  // }

  // async deleteTeam() {
  //   this.drs.deleteTeam(this.teamId, this.clubId);

  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   await this.drs.resync();
  //   this.drs.needsUpdateUserData.next(true);
  //   this.router.navigate(['/my-clubs/detail', this.clubId]);
  //   this.ns.showToast('Team gelöscht');
  // }

  // resetChanges() {
  //   console.log('reset');
  //   this.hasChanges = false;
  //   this.editGroup = this.fb.group({
  //     name: [
  //       this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).name,
  //       [Validators.required],
  //     ],
  //   });

  //   this.addGroup = this.fb.group({
  //     uid: [
  //       '',
  //       [Validators.required, Validators.minLength(6), Validators.pattern('/^[a-zA-Z0-9-_]+$/')],
  //     ],
  //     aname: ['', [Validators.required]],
  //     asCoach: [false],
  //   });

  //   this.members = this.drs.syncedClubs
  //     .get(this.clubId)
  //     .clubData.teams.get(this.teamId).teamData.roles;

  //   this.editGroup.valueChanges.subscribe((data) => {
  //     this.hasChanges = true;
  //   });
  // }
  roleStrings = {
    trainer: 'Trainer',
    athlete: 'Athlet',
    headTrainer: 'Cheftrainer',
    admin: 'Admin',
  };
}
