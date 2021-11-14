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
  constructor(public drs: DataRepositoryService, public auth: AuthService, private router: Router) {
    // if (!this.drs.currentUser) {
    //   this.router.navigate(['/login']);
    // }
  }
  displayableClubs: Object[] = [];

  ngOnInit() {
    // this.drs.needsUpdateUserData.subscribe(() => {
    //   const memberships = this.drs.currentUser.getValue().memberships;
    //   console.log(memberships);
    //   // set displayable clubs to be the clubs the user is a member of with role 'admin' or role 'owner'
    //   this.displayableClubs = memberships.filter((membership) => {
    //     return (
    //       (membership['role'] === 'admin' || membership['role'] === 'owner') &&
    //       membership['type'] === 'club'
    //     );
    //   });
    // });
  }
}
