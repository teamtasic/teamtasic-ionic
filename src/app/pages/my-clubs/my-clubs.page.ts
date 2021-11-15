import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { LogicService } from 'src/app/services/logic.service';

@Component({
  selector: 'app-my-clubs',
  templateUrl: './my-clubs.page.html',
  styleUrls: ['./my-clubs.page.scss'],
})
export class MyClubsPage implements OnInit {
  constructor(
    public drs: DataRepositoryService,
    public auth: AuthService,
    private router: Router,
    public logic: LogicService
  ) {}
  displayableClubs: Object[] = [];

  ngOnInit() {
    this.drs.clubs.subscribe((clubs) => {
      this.displayableClubs = [];
      clubs.forEach((club) => {
        if (club.admins.includes(this.drs.authUsers.value[0].uid)) {
          this.displayableClubs.push({
            displayName: club.name,
            club: club.uid,
          });
        }
      });
    });
  }
}
