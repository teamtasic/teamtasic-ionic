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

  clubId: string;

  teamCreateForm: FormGroup;

  ngOnInit() {
    this.teamCreateForm = this.fb.group({
      teamName: ['', Validators.required],
    });

    this.teamCreateForm.valueChanges.subscribe((data) => {
      console.log(data);
    });

    this.clubId = this.route.snapshot.paramMap.get('clubId');
  }

  async createTeam() {
    let user = this.drs.currentUser.getValue();
    const roles = {
      [user.uid]: {
        name: user.username,
        role: 'owner',
      },
    };
    const team = new Team('', undefined, this.teamName.value);
    const teamData = new TeamData(roles);

    team.uid = await (await this.drs.addTeam(team, this.clubId)).ref.id;
    user.memberships[team.uid] = {
      role: 'owner',
      displayName: team.name,
      name: user.username,
      type: 'team',
    };
    console.log(user);

    await this.drs.setTeamData(team.uid, this.clubId, teamData);
    this.drs.currentUser.next(user);
    await this.drs.updateUser();
  }
  get teamName() {
    return this.teamCreateForm.get('teamName');
  }
}
