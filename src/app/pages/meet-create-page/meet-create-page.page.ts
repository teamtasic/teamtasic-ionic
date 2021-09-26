import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonDatetime, ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-meet-create-page',
  templateUrl: './meet-create-page.page.html',
  styleUrls: ['./meet-create-page.page.scss'],
})
export class MeetCreatePagePage implements OnInit {
  constructor(
    private modalController: ModalController,
    private drs: DataRepositoryService,
    private fb: FormBuilder
  ) {}

  today: string = new Date(Date.now()).toISOString();

  @Input() clubId: string;
  @Input() teamId: string;

  meetCreateGroup: FormGroup;

  ngOnInit() {
    this.meetCreateGroup = this.fb.group({
      meetName: ['', [Validators.required]],
      meetLocation: ['', [Validators.required]],
      meetDate: [this.today, [Validators.required]],
      meetTime: [this.today, [Validators.required]],
      meetEndTime: [this.today, [Validators.required]],
    });
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async createMeet() {
    let date: Date = new Date(Date.parse(this.meetCreateGroup.value.meetDate));

    let start: Date = new Date(Date.parse(this.meetCreateGroup.value.meetTime));
    let end: Date = new Date(Date.parse(this.meetCreateGroup.value.meetEndTime));

    let startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      start.getHours(),
      start.getMinutes()
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
      this.clubId,
      this.teamId
    );
    await this.drs.createMeet(meet, this.teamId, this.clubId);

    this.modalController.dismiss();
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
}
