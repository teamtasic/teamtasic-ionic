import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { Team } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { LogService } from 'src/app/services/log-service.service';
import { formatISO } from 'date-fns';
@Component({
  selector: 'app-meet-create',
  templateUrl: './meet-create.component.html',
  styleUrls: ['./meet-create.component.scss'],
})
export class MeetCreateComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public drs: DataRepositoryService,
    private modalController: ModalController,
    private logger: LogService
  ) {}

  today: string = new Date(Date.now()).toISOString();

  @Input() clubId: string = '';
  @Input() teamId: string = '';
  @Input() sessionId: string = '';
  @Input() templateMeet: Meet | undefined;

  meet: Meet = Meet.null;

  meetCreateGroup: FormGroup = this.fb.group({});
  teamSelectionForm: FormGroup = this.fb.group({
    teams: this.fb.array([]),
  });

  teams: Team[] = [];

  oldMeet: Meet | undefined;

  ngOnInit() {
    this.meet = this.templateMeet || Meet.null;

    var startDate = formatISO(this.meet.start);
    var endDate = formatISO(this.meet.end);

    this.meetCreateGroup = this.fb.group({
      meetName: [this.meet.title, [Validators.required]],
      meetLocation: [this.meet.meetpoint, [Validators.required]],
      meetDate: [startDate, [Validators.required]],
      meetEndTime: [endDate, [Validators.required]],
      meetComment: [this.meet.comment],
      meetDeadline: [
        this.meet.deadline,
        [Validators.required, Validators.min(-1), Validators.max(14), Validators.pattern('[0-9]*')],
      ],
      provisionally: [this.meet.provisionally],
      limitedSlots: [this.meet.limitedSlots],
      slots: [this.meet.slots],
    });

    this.drs.teams.subscribe((teams) => {
      for (let team of teams) {
        if (team.isHeadTrainer(this.sessionId)) {
          this.teams?.push(team);
        }
      }
      this.teamSelectionForm = this.fb.group({
        teams: this.fb.array(this.teams.map((team) => new FormControl(team.uid == this.teamId))),
      });
    });

    this.meetCreateGroup.valueChanges.subscribe((value) => {
      let date: Date = new Date(Date.parse(this.meetCreateGroup.value.meetDate));
      let end: Date = new Date(Date.parse(this.meetCreateGroup.value.meetEndTime));
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

      this.meet = new Meet(
        '',
        this.meetCreateGroup.value.meetName,
        startDate,
        endDate,
        this.meetCreateGroup.value.meetLocation,
        '',
        '',
        [],
        [],
        this.meetComment?.value,
        this.meetDeadline?.value,
        {},
        this.meetProvisionally?.value,
        this.meetCreateGroup.value.limitedSlots,
        this.meetCreateGroup.value.slots,
        this.meet.tasks
      );
    });
  }

  async createMeet() {
    for (const [index, team] of this.teams.entries()) {
      if (this.teamSelectionForm.controls['teams'].value[index]) {
        let meet = this.meet;
        [meet.clubId, meet.teamId] = [team.owner, team.uid];
        await this.drs.createMeet(meet, team.owner, team.uid);
      }
    }
    this.modalController.dismiss();
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  get meetName() {
    return this.meetCreateGroup.get('meetName');
  }
  get meetLocation() {
    return this.meetCreateGroup.get('meetLocation');
  }
  get meetDate() {
    return this.meetCreateGroup.get('meetDate');
  }
  get meetTime() {
    return this.meetCreateGroup.get('meetTime');
  }
  get meetEndTime() {
    return this.meetCreateGroup.get('meetEndTime');
  }
  get meetComment() {
    return this.meetCreateGroup.get('meetComment');
  }
  get meetDeadline() {
    return this.meetCreateGroup.get('meetDeadline');
  }
  get meetProvisionally() {
    return this.meetCreateGroup.get('provisionally');
  }

  // get taskTitle() {
  //   return this.taskCreationForm.get('title');
  // }
  // get taskSlots() {
  //   return this.taskCreationForm.get('slots');
  // }
}
