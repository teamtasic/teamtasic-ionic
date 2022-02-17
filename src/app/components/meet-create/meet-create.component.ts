import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { Team } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-meet-create',
  templateUrl: './meet-create.component.html',
  styleUrls: ['./meet-create.component.scss'],
})
export class MeetCreateComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public drs: DataRepositoryService,
    private modalController: ModalController
  ) {}

  teamSelectionForm: FormGroup = this.fb.group({
    teams: this.fb.array([]),
  });

  today: string = new Date(Date.now()).toISOString();

  @Input() clubId: string = '';
  @Input() teamId: string = '';
  @Input() sessionId: string = '';
  @Input() templateMeet: Meet | undefined;

  meetCreateGroup: FormGroup = this.fb.group({});

  teams: Team[] = [];

  ngOnInit() {
    if (this.templateMeet) {
      var tzoffset = new Date().getTimezoneOffset() * 60000;
      var startDate = new Date(this.templateMeet.start.getTime() - tzoffset);
      var endDate = new Date(this.templateMeet.end.getTime() - tzoffset);

      this.meetCreateGroup = this.fb.group({
        meetName: [this.templateMeet.title, [Validators.required]],
        meetLocation: [this.templateMeet.meetpoint, [Validators.required]],
        meetDate: [startDate.toISOString(), [Validators.required]],
        meetEndTime: [endDate.toISOString(), [Validators.required]],
        meetComment: [this.templateMeet.comment],
        meetDeadline: [
          this.templateMeet.deadline,
          [
            Validators.required,
            Validators.min(-1),
            Validators.max(14),
            Validators.pattern('[0-9]*'),
          ],
        ],
      });
    } else {
      this.meetCreateGroup = this.fb.group({
        meetName: ['', [Validators.required]],
        meetLocation: ['', [Validators.required]],
        meetDate: ['', [Validators.required]],
        meetEndTime: ['', [Validators.required]],
        meetComment: [''],
        meetDeadline: [
          '0',
          [
            Validators.required,
            Validators.min(-1),
            Validators.max(14),
            Validators.pattern('[0-9]*'),
          ],
        ],
      });
    }
    this.drs.teams.subscribe((teams) => {
      for (let team of teams) {
        if (team.headTrainers.includes(this.sessionId)) {
          this.teams?.push(team);
        }
      }
      this.teamSelectionForm = this.fb.group({
        teams: this.fb.array(this.teams.map((team) => new FormControl(team.uid == this.teamId))),
      });
    });
  }

  async createMeet() {
    for (const [index, team] of this.teams.entries()) {
      if (this.teamSelectionForm.controls['teams'].value[index]) {
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

        let meet = new Meet(
          '',
          this.meetCreateGroup.value.meetName,
          startDate,
          endDate,
          this.meetCreateGroup.value.meetLocation,
          team.owner,
          team.uid,
          [],
          [],
          this.meetComment?.value,
          this.meetDeadline?.value,
          {},
          false
        );
        await this.drs.createMeet(meet, team.owner, team.uid);
      }
    }
    this.modalController.dismiss();
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
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
}
