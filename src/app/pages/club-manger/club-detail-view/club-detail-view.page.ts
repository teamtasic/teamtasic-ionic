import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  retry,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Club } from 'src/app/classes/club';
import { Team } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { LogicService } from 'src/app/services/logic.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-club-detail-view',
  templateUrl: './club-detail-view.page.html',
  styleUrls: ['./club-detail-view.page.scss'],
})
export class ClubDetailViewPage implements OnInit {
  constructor(
    private drs: DataRepositoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public ns: NotificationService,
    public logic: LogicService
  ) {}

  editClub: FormGroup = this.fb.group({
    name: ['', Validators.required],
  });
  addAdminGroup: FormGroup = this.fb.group({
    uid: ['', [Validators.required]],
  });

  clubId: string = '';
  club: Club = new Club('', '', {}, [], []);
  teams: Team[] = [];

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.clubId = params.clubId;
      console.log(this.clubId);
      await this.drs.syncClub(this.clubId);
      this.club = this.drs.clubs.value.find((c) => c.uid === this.clubId) as Club;
    });

    this.drs.clubs.subscribe((clubs) => {
      this.club = clubs.find((c) => c.uid === this.clubId) as Club;
    });
    this.drs.teams.subscribe((teams) => {
      this.teams = teams.filter((t) => t.owner === this.clubId) as any;
    });
  }

  public saveClub() {
    this.ns.showToast('Fehler beim speichern.');
  }

  public async addAdmin() {}
}
