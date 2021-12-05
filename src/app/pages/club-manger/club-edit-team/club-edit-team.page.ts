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

import { Clipboard } from '@capacitor/clipboard';
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

  roleStrings = {
    trainer: 'Trainer',
    athlete: 'Athlet',
    headTrainer: 'Cheftrainer',
    admin: 'Admin',
  };

  async addMember() {
    try {
      const code = await this.drs.getJoinCodeForTeam(this.teamId, this.clubId, 'member');
      await Clipboard.write({
        string: code,
      });
      this.ns.showToast('Code in die Zwischenablage kopiert');
    } catch (e) {
      this.ns.showToast('Fehler beim Erstellen des Codes');
      console.warn(e);
    }
  }
  async addTrainer() {
    try {
      const code = await this.drs.getJoinCodeForTeam(this.teamId, this.clubId, 'coach');
      await Clipboard.write({
        string: code,
      });
      this.ns.showToast('Code in die Zwischenablage kopiert');
    } catch (e) {
      this.ns.showToast('Fehler beim Erstellen des Codes');
      console.warn(e);
    }
  }
  async addHeadcoach() {
    try {
      const code = await this.drs.getJoinCodeForTeam(this.teamId, this.clubId, 'headcoach');
      await Clipboard.write({
        string: code,
      });
      this.ns.showToast('Code in die Zwischenablage kopiert');
    } catch (e) {
      this.ns.showToast('Fehler beim Erstellen des Codes');
      console.warn(e);
    }
  }
}
