import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    private router: Router,
    private fb: FormBuilder
  ) {
    if (!this.drs.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  editClub: FormGroup;

  clubId: string;
  club: Club;

  admins: Object[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.clubId = params.get('clubId');
    });

    this.drs.needsUpdateUserData.subscribe(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.reload();
    });
    this.reload();
    for (const member in this.club.clubData.users) {
      if (this.club.clubData.users[member].role === 'admin') {
        this.admins.push(this.club.clubData.users[member]);
      } else if (this.club.clubData.users[member].role === 'owner') {
        this.admins.push(this.club.clubData.users[member]);
      }
    }

    this.editClub = this.fb.group({
      name: [this.club.name, [Validators.required]],
    });
  }

  reload() {
    this.club = this.drs.syncedClubs.get(this.clubId);
  }
}
