import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  statusColors = { accepted: 'success', declined: 'danger', pending: 'dark' };

  statusString = {
    accepted: 'Angenommen',
    declined: 'Abgelehnt',
    pending: 'Ausstehend',
  };

  constructor(private drs: DataRepositoryService) {}

  async ngOnInit() {
    this.drs.syncClub('xqf0GKc6NCz58KD1EV1A');
    console.log(this.drs.syncTeam('5OmqMrc1UrR1pc627ced', 'x89IVPUQHI9hU8LoWH37'));
    this.drs.syncSessionUsers('3Qux1Gaz3TVyHNjgDtA9lKghIAm1');
    this.drs.syncSessionUsers('3Qux1Gaz3TVyHNjgDtA9lKghIAm1');
  }
}
