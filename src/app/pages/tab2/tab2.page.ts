import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PopoverController, IonSelect } from '@ionic/angular';
import { MeetCreatePagePage } from '../meet-create-page/meet-create-page.page';
import { ModalController } from '@ionic/angular';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meet } from 'src/app/classes/meet';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  statusColors = { accepted: 'success', declined: 'danger', pending: 'dark' };

  hasTrainerPermission: boolean = false;

  showSelectPromt: boolean;

  selectedMembershipIndex = 0;
  selectableMemberships: selectableMembership[] = [];

  viewMode: 'list' | 'single' = 'single';
  displayableMeets = [];

  statusString = {
    accepted: 'Angenommen',
    declined: 'Abgelehnt',
    pending: 'Ausstehend',
  };

  @ViewChild('selector') selectRef: IonSelect;
  constructor(
    private modalController: ModalController,
    public drs: DataRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // for the memberships of drs.currentUser.getValue(), add an entrie to the selectableMemberships array if the memberships role is either 'athlete' or 'trainer'
    this.drs.currentUser.getValue().memberships.forEach((membership) => {
      if (membership['role'] == 'athlete' || membership['role'] == 'trainer') {
        this.selectableMemberships.push(
          new selectableMembership(
            membership['team'],
            membership['club'],
            membership['userId'],
            membership['role'],
            membership['name']
          )
        );
        console.log(this.selectableMemberships);
        // set display string
        this.selectableMemberships[this.selectableMemberships.length - 1].displayString =
          this.getMembershipsDisplayText(
            this.selectableMemberships[this.selectableMemberships.length - 1]
          );
      }
    });
    this.selectedMembershipIndex = 0;
    console.log(this.selectableMemberships);

    this.onTeamSelect();
  }
  async onTeamSelect() {
    console.log('onTeamSelect:', this.selectedMembershipIndex);
    // load meets for selected team
    const selMembership = this.selectableMemberships[this.selectedMembershipIndex];
    if (selMembership) {
      this.displayableMeets = await this.drs.getMeets(
        selMembership.teamId,
        selMembership.clubId,
        0,
        9,
        selMembership.userId
      );
      this.hasTrainerPermission = selMembership.role == 'trainer';
      this.buildDisplayStrings();
    }
  }

  buildDisplayStrings() {
    const selMembership = this.selectableMemberships[this.selectedMembershipIndex];
    // set display strings
    this.displayableMeets.forEach((meet: Meet) => {
      meet.signedInUserStrings = [];
      meet.acceptedUsers.forEach((user) => {
        if (
          this.drs.syncedClubs.get(selMembership.clubId).clubData.teams.get(selMembership.teamId)
            .teamData.roles[user]
        )
          meet.signedInUserStrings.push(
            this.drs.syncedClubs.get(selMembership.clubId).clubData.teams.get(selMembership.teamId)
              .teamData.roles[user].name
          );
      });
      meet.signedOutUserStrings = [];
      meet.declinedUsers.forEach((user) => {
        meet.signedOutUserStrings.push(
          this.drs.syncedClubs.get(selMembership.clubId).clubData.teams.get(selMembership.teamId)
            .teamData.roles[user].name
        );
      });
    });
  }

  async presentAddModal() {
    const modal = await this.modalController.create({
      component: MeetCreatePagePage,
      componentProps: {
        teamId: this.selectableMemberships[this.selectedMembershipIndex].teamId,
        clubId: this.selectableMemberships[this.selectedMembershipIndex].clubId,
      },
    });
    return await modal.present();
  }

  async toggleUserStatus(index: number) {
    this.displayableMeets[index].currentsUsersStatus.next(
      this.displayableMeets[index].currentsUsersStatus.getValue().cycleStatus()
    );

    if (this.displayableMeets[index].currentsUsersStatus.observers.length <= 1) {
      this.displayableMeets[index].currentsUsersStatus
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(async (x) => {
          console.log('debounced');
          const selMembership = this.selectableMemberships[this.selectedMembershipIndex];
          this.displayableMeets[index] = await this.drs.writeMutationRequest(
            selMembership.clubId,
            selMembership.teamId,
            this.displayableMeets[index].uid,
            selMembership.userId,
            this.displayableMeets[index].currentsUsersStatus.getValue().status,
            this.displayableMeets[index]
          );
          this.rebuildDisplayStrings(index);
          this.displayableMeets[index].currentsUsersStatus.observers[1].unsubscribe();
        });
    }
  }
  async rebuildDisplayStrings(index: number) {
    this.displayableMeets[index].fixUserStatus(
      this.selectableMemberships[this.selectedMembershipIndex].userId
    );
    this.buildDisplayStrings();
  }
  getMembershipsDisplayText(membership: selectableMembership) {
    //this.drs.syncedClubs.get(membership.clubId).name;

    return `${
      this.drs.syncedClubs.get(membership.clubId).clubData.teams.get(membership.teamId).name
    } - ${membership.username}`;
  }
}

class selectableMembership {
  teamId: string;
  clubId: string;
  userId: string;
  role: string;
  displayString: string = 'MISSINGDISPLAYNAME';
  signedOutUserStrings = [];
  signedInUserStrings = [];
  username: string;
  constructor(teamId: string, clubId: string, userId: string, role: string, username: string) {
    this.teamId = teamId;
    this.clubId = clubId;
    this.userId = userId;
    this.role = role;
    this.username = username;
  }
}
