import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { Team } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-admin-set-member-status',
  templateUrl: './admin-set-member-status.component.html',
  styleUrls: ['./admin-set-member-status.component.scss'],
})
export class AdminSetMemberStatusComponent implements OnInit {
  @Input() sessionId: string = '';
  @Input() meet: Meet | undefined;
  @Input() team: Team | undefined;
  constructor(private drs: DataRepositoryService, private popoverController: PopoverController) {}

  ngOnInit() {}

  async setState(status: 'accepted' | 'declined' | 'unknown') {
    await this.drs
      .updateMeetStatus(
        this.meet?.clubId || '',
        this.meet?.teamId || '',
        this.meet?.uid || '',
        status,
        this.sessionId,
        this.meet?.comment || '',
        this.meet?.deadline || 0,
        this.meet?.meetpoint || '',
        this.meet?.comments || {},
        this.meet?.provisionally || false
      )
      .catch();
    this.popoverController.dismiss();
  }
}
