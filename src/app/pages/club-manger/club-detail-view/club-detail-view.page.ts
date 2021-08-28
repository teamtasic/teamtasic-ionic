import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Club } from 'src/app/classes/club';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-club-detail-view',
  templateUrl: './club-detail-view.page.html',
  styleUrls: ['./club-detail-view.page.scss'],
})
export class ClubDetailViewPage implements OnInit {
  constructor(
    private drs: DataRepositoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    console.log('construct');
  }

  clubId: string;
  club: Club;

  admins: Object[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
    });
    console.log('init 2');
    this.club = this.drs.syncedClubs.get(this.clubId);

    for (const member in this.club.clubData.users) {
      if (this.club.clubData.users[member].role === 'admin') {
        this.admins.push(this.club.clubData.users[member]);
      } else if (this.club.clubData.users[member].role === 'owner') {
        this.admins.push(this.club.clubData.users[member]);
      }
    }
  }

  reload() {
    this.club = this.drs.syncedClubs.get(this.clubId);
  }
}
