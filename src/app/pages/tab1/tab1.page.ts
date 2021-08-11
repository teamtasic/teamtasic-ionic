import { Component } from '@angular/core';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  userHasJoinedTeam: boolean = true;
  hasTrainings: boolean = true;

  constructor(private auth: AuthService, private drs: DataRepositoryService) {
    this.userHasJoinedTeam = this.drs.currentMemberships.length > 0;
  }
}
