import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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

  constructor() {}

  ngOnInit() {}
}
