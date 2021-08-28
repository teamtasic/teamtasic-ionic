import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-my-clubs',
  templateUrl: './my-clubs.page.html',
  styleUrls: ['./my-clubs.page.scss'],
})
export class MyClubsPage implements OnInit {
  constructor(public drs: DataRepositoryService, public auth: AuthService) {}
  displayableClubs: Map<string, string> = new Map();

  ngOnInit() {
    console.log('init)');
    const memberships = this.drs.currentUser.getValue().memberships;
    Object.keys(memberships).forEach((membership) => {
      if (
        memberships[membership].type === 'club' &&
        (memberships[membership].role === 'owner' || memberships[membership].role === 'admin')
      ) {
        this.displayableClubs.set(membership, memberships[membership].displayName);
      }
    });
  }
}
