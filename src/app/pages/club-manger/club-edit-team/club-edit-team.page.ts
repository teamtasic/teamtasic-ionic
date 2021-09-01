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
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Remove',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
          },
        },
        {
          text: 'Make trainer',
          icon: 'person-add-outline',
          handler: () => {
            console.log('Share clicked');
          },
        },
        {
          text: 'Make athlete',
          icon: 'person-remove-outline',
          handler: () => {
            console.log('Share clicked');
          },
        },
        {
          text: 'See user',
          icon: 'list-outline',
          handler: () => {
            console.log('Play clicked');
          },
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

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
