import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-club-edit-team',
  templateUrl: './club-edit-team.page.html',
  styleUrls: ['./club-edit-team.page.scss'],
})
export class ClubEditTeamPage implements OnInit {
  items = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private drs: DataRepositoryService
  ) {}

  editGroup: FormGroup;

  clubId: string;
  teamId: string;

  memebers: Object[];
  d_memebers: Object[];

  searchValue: string;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
      this.teamId = params.get('teamId');
    });

    this.editGroup = this.fb.group({
      name: [
        this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).name,
        [Validators.required],
      ],
      searchterm: ['', []],
    });

    for (let member in this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId)
      .teamData.roles) {
      this.memebers.push(
        this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).teamData.roles[member]
      );
      this.memebers[this.memebers.length - 1]['id'] = member;
    }
    console.log(this.memebers);
    console.log(
      this.drs.syncedClubs.get(this.clubId).clubData.teams.get(this.teamId).teamData.roles
    );
  }

  search() {
    console.log(this.searchValue);
  }

  filterItems(searchTerm) {
    return this.memebers.filter((member) => {
      return member['username'].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    this.d_memebers = this.filterItems(this.searchterm.value);
    console.log(this.d_memebers);
  }

  get searchterm() {
    return this.editGroup.get('searchterm');
  }
}
