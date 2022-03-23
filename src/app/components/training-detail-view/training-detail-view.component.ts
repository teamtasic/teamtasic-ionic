import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { formatISO } from 'date-fns';
import { Meet } from 'src/app/classes/meet';
import { Team } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { LogService } from 'src/app/services/log-service.service';
import { NotificationService } from 'src/app/services/notification-service.service';
import { AdminSetMemberStatusComponent } from '../admin-set-member-status/admin-set-member-status.component';
import { MeetCreateComponent } from '../meet-create/meet-create.component';

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
    private ns: NotificationService,
    private fb: FormBuilder,
    private popoverController: PopoverController,
    private logger: LogService
  ) {}

  @Input() sessionId: string = '';
  @Input() teamId: string = '';
  @Input() clubId: string = '';
  @Input() meet: Meet = Meet.null;

  team: Team | undefined;
  //presentational fields
  trainers_accepted: string[] = [];
  trainers_declined: string[] = [];
  trainers_else: string[] = [];
  members_accepted: string[] = [];
  members_declined: string[] = [];
  members_else: string[] = [];

  meetForm: FormGroup = this.fb.group({});
  commentForm: FormGroup = this.fb.group({});

  today: string = new Date(Date.now()).toISOString();

  status: 'accepted' | 'declined' | 'unknown' | undefined = 'unknown';
  trainersOpen: boolean = false;
  usersOpen: boolean = true;

  async ngOnInit() {
    this.drs.teams.subscribe((teams) => {
      teams.find((team) => {
        if (team.uid === this.teamId) {
          this.team = team;
        }
      });
      this.significantChange();
    });

    this.drs.meets.subscribe((meets) => {
      this.logger.info('meet change accepted in detail');
      meets.find((meet) => {
        if (meet.uid === this.meet?.uid) {
          this.meet = meet;
          var startDate = formatISO(this.meet.start);
          var endDate = formatISO(this.meet.end);

          this.meetForm = this.fb.group({
            meetpoint: [meet.meetpoint, Validators.required],
            comment: [meet.comment],
            title: [meet.title, Validators.required],
            deadline: [meet.deadline, Validators.required],
            provisionally: [meet.provisionally],
            meetDate: [startDate, [Validators.required]],
            meetEndTime: [endDate, [Validators.required]],
            slots: [meet.slots, [Validators.required, Validators.min(meet.acceptedUsers.length)]],
            limitedSlots: [meet.limitedSlots],
          });
          this.commentForm = this.fb.group({
            comment: [meet.comments[this.sessionId] || '', []],
          });
        }
      });
      this.significantChange();
    });

    this.meetForm.valueChanges.subscribe((value) => {
      [
        this.meet.meetpoint,
        this.meet.comment,
        this.meet.title,
        this.meet.deadline,
        this.meet.provisionally,
        this.meet.start,
        this.meet.end,
        this.meet.slots,
        this.meet.limitedSlots,
        this.meet.tasks,
      ] = [
        value.meetpoint,
        value.comment,
        value.title,
        value.deadline,
        value.provisionally,
        new Date(Date.parse(value.meetDate)),
        new Date(Date.parse(value.meetEndTime)),
        value.slots,
        value.limitedSlots,
        this.meet.tasks,
      ];
    });

    this.drs.syncTeam(this.teamId, this.clubId);
  }

  isOpenToChanges(a = false) {
    if (this.team?.isHeadTrainer(this.sessionId) && !a) return true;
    if (this.meet) {
      // is it 24h before the meet?
      return (
        (this.meet.start as any) > new Date(Date.now() + 24 * 60 * 60 * 1000 * this.meet.deadline)
      );
    }
    return false;
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
        if (!this.team?.hiddenMembers.includes(uid)) {
          if (this.meet?.acceptedUsers.includes(uid)) {
            this.members_accepted.push(uid);
          } else if (this.meet?.declinedUsers.includes(uid)) {
            this.members_declined.push(uid);
          } else {
            this.members_else.push(uid);
          }
        }
      });
      this.team.trainers.forEach((uid) => {
        if (!this.team?.hiddenMembers.includes(uid)) {
          if (this.meet?.acceptedUsers.includes(uid)) {
            this.trainers_accepted.push(uid);
          } else if (this.meet?.declinedUsers.includes(uid)) {
            this.trainers_declined.push(uid);
          } else {
            this.trainers_else.push(uid);
          }
        }
      });
      this.logger.debug(this.trainers_else);

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
    this.meet?.acceptedUsers.splice(this.meet?.acceptedUsers.indexOf(this.sessionId), 1);
    this.meet?.declinedUsers.splice(this.meet?.declinedUsers.indexOf(this.sessionId), 1);

    if (!this.meet) return;
    this.meet.comments[this.sessionId] = this.commentForm.value.comment;

    const date: Date = new Date(Date.parse(this.meetForm.value.meetDate));
    const end: Date = new Date(Date.parse(this.meetForm.value.meetEndTime));

    let startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    );
    let endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      end.getHours(),
      end.getMinutes()
    );

    await this.drs.updateMeetStatus(
      this.clubId,
      this.teamId,
      this.meet?.uid || '',
      this.meetForm.value.title || '',
      this.status || 'unknown',
      this.sessionId,
      this.meetForm.value.comment,
      this.meetForm.value.deadline,
      this.meetForm.value.meetpoint,
      this.meet?.comments || {},
      this.meetForm.value.provisionally || false,
      Meet.convertToFBTimestamp(startDate),
      Meet.convertToFBTimestamp(end),
      this.meetForm.value.slots,
      this.meetForm.value.limitedSlots || false,
      this.meet?.tasks || []
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
        },
        {
          text: 'Delete',
          cssClass: 'secondary',
          handler: () => {
            this.drs.deleteMeet(this.clubId, this.teamId, this.meet?.uid ?? '');
            this.ns.showToast('Training gelöscht');
            this.modalController.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }
  async copy() {
    const modal = await this.modalController.create({
      component: MeetCreateComponent,
      componentProps: {
        clubId: this.clubId,
        teamId: this.teamId,
        sessionId: this.sessionId,
        templateMeet: this.meet,
      },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  change(event: any) {
    this.status = event.detail.value;
  }

  async openStatusModal(ev: any, userId: string) {
    if (this.team?.trainers.includes(this.sessionId)) {
      const popover = await this.popoverController.create({
        component: AdminSetMemberStatusComponent,
        componentProps: {
          sessionId: userId,
          meet: this.meet,
          team: this.team,
        },
        event: ev,
        reference: 'event',
      });
      await popover.present();
    }
  }

  saveICS() {
    let icscontent = 'data:text/calendar;charset=utf-8,' + this.meet?.icsFile;
    var encodedUri = encodeURI(icscontent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${this.meet.title}-${this.meet.start.toISOString()}-Teamtasic.ics`
    );
    document.body.appendChild(link); // Required for FF
    link.click();
  }
}
