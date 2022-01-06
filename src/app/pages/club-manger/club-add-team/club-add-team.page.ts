import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Team, TeamData } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-club-add-team',
  templateUrl: './club-add-team.page.html',
  styleUrls: ['./club-add-team.page.scss'],
})
export class ClubAddTeamPage implements OnInit {
  constructor(
    private drs: DataRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  clubId: string = '';

  teamCreateForm: FormGroup = this.fb.group({});

  ngOnInit() {
    this.teamCreateForm = this.fb.group({
      teamName: ['', Validators.required],
    });

    this.route.params.subscribe(async (params) => {
      this.clubId = params.clubId;
    });
  }

  async createTeam() {
    const team = new Team('', this.teamName?.value, {}, [], [], [], []);
    this.drs.createTeam(team, this.clubId);

    this.router.navigate(['/my-clubs/detail', this.clubId]);
  }
  get teamName() {
    return this.teamCreateForm.get('teamName');
  }
}
