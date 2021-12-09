import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { Team } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-training-detail-view',
  templateUrl: './training-detail-view.component.html',
  styleUrls: ['./training-detail-view.component.scss'],
})
export class TrainingDetailViewComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    public drs: DataRepositoryService,
    private alertController: AlertController,
    private ns: NotificationService
  ) {}

  @Input() sessionId: string;
  @Input() teamId: string;
  @Input() clubId: string;
  @Input() meet: Meet;
  team: Team;
  //presentational fields
  trainers_accepted = [];
  trainers_declined = [];
  trainers_else = [];
  members_accepted = [];
  members_declined = [];
  members_else = [];

  comment = '';

  isOpenToChanges(a = false) {
    if (this.team.headTrainers.includes(this.sessionId) && !a) return true;
    if (this.meet) {
      // is it 24h before the meet?
      return (
        (this.meet.start as any) > new Date(Date.now() + 24 * 60 * 60 * 1000 * this.meet.deadline)
      );
    }
    return false;
  }

  async ngOnInit() {
    this.drs.syncTeam(this.teamId, this.clubId);
    this.drs.teams.subscribe((teams) => {
      teams.find((team) => {
        if (team.uid === this.teamId) {
          this.team = team;
        }
      });
      this.significantChange();
    });
    this.drs.meets.subscribe((meets) => {
      meets.find((meet) => {
        if (meet.uid === this.meet.uid) {
          this.meet = meet;
          this.comment = meet.comment;
        }
      });
      this.significantChange();
    });
  }

  async significantChange() {
    this.trainers_accepted = [];
    this.trainers_declined = [];
    this.trainers_else = [];
    this.members_accepted = [];
    this.members_declined = [];
    this.members_else = [];

    if (this.team && this.meet) {
      const usersToRemove = new Set(this.team.trainers);

      const usersWOtrainers = this.team.users.filter((name) => {
        return !usersToRemove.has(name);
      });
      usersWOtrainers.forEach((uid) => {
        if (uid == this.sessionId) {
          // pass
        } else if (this.meet.acceptedUsers.includes(uid)) {
          this.members_accepted.push(uid);
        } else if (this.meet.declinedUsers.includes(uid)) {
          this.members_declined.push(uid);
        } else {
          this.members_else.push(uid);
        }
      });
      this.team.trainers.forEach((uid) => {
        if (uid == this.sessionId) {
          // pass
        } else if (this.meet.acceptedUsers.includes(uid)) {
          this.trainers_accepted.push(uid);
        } else if (this.meet.declinedUsers.includes(uid)) {
          this.trainers_declined.push(uid);
        } else {
          this.trainers_else.push(uid);
        }
      });
      console.log(this.trainers_else);

      this.status = this.meet.acceptedUsers.includes(this.sessionId) ? 'accepted' : undefined;
      if (!this.status) {
        this.status = this.meet.declinedUsers.includes(this.sessionId) ? 'declined' : 'unknown';
      }
    }
  }
  dismiss() {
    this.modalController.dismiss();
  }
  async save() {
    this.meet.acceptedUsers.splice(this.meet.acceptedUsers.indexOf(this.sessionId), 1);
    this.meet.declinedUsers.splice(this.meet.declinedUsers.indexOf(this.sessionId), 1);

    await this.drs.updateMeetStatus(
      this.clubId,
      this.teamId,
      this.meet.uid,
      this.status,
      this.sessionId,
      this.comment
    );
    this.modalController.dismiss();
  }
  async delete() {
    const alert = await this.alertController.create({
      header: 'Löschen bestätigen',
      message: 'Diese Aktion kann nicht rückgägig gemacht werden.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Delete',
          cssClass: 'secondary',
          handler: () => {
            this.drs.deleteMeet(this.clubId, this.teamId, this.meet.uid);
            this.ns.showToast('Training gelöscht');
            this.modalController.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  status: 'accepted' | 'declined' | 'unknown' = 'unknown';
  trainersOpen: boolean = false;
  usersOpen: boolean = true;

  change(event) {
    this.status = event.detail.value;
  }

  toggleTrainers() {
    this.trainersOpen = !this.trainersOpen;
  }
  toggleUsers() {
    this.usersOpen = !this.usersOpen;
  }
  commentChange(event) {
    this.comment = event.detail.value;
  }
}
