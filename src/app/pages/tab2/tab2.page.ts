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

  async ngOnInit() {}
}
