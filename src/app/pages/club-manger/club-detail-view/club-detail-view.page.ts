import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Club } from 'src/app/classes/club';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { NotificationService } from 'src/app/services/notification-service.service';

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
    private fb: FormBuilder,
    public ns: NotificationService
  ) {
    // if (!this.drs.currentUser) {
    //   this.router.navigate(['/login']);
    // }
  }
  ngOnInit() {}
  // editClub: FormGroup;
  // addAdminGroup: FormGroup = this.fb.group({
  //   name: ['', [Validators.required]],
  //   uid: ['', [Validators.required]],
  // });

  // clubId: string;
  // club: Club;

  // admins: Object[] = [];
  // userState: 'none' | 'loading' | 'verified' = 'none';
  // ngOnInit() {
  //   this.route.paramMap.subscribe((params) => {
  //     this.clubId = params.get('clubId');
  //   });
  //   this.reload();
  //   console.log(this.club);

  //   this.editClub = this.fb.group({
  //     name: [this.club.name, [Validators.required]],
  //   });

  //   this.drs.needsUpdateUserData.subscribe(async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 500));
  //     this.reload();
  //   });

  //   for (const member in this.club.clubData.users) {
  //     if (this.club.clubData.users[member].role === 'admin') {
  //       this.admins.push(this.club.clubData.users[member]);
  //     } else if (this.club.clubData.users[member].role === 'owner') {
  //       this.admins.push(this.club.clubData.users[member]);
  //     }
  //   }

  //   this.addAdminGroup.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       distinctUntilChanged(),
  //       tap((data) => {
  //         this.userState = 'loading';
  //       }),
  //       switchMap((data) => {
  //         if (data.uid.length != 0) {
  //           return this.drs.userExists(data.uid);
  //         } else {
  //           return new Promise<Boolean>((resolve) => {
  //             resolve(false);
  //           });
  //         }
  //       }),
  //       tap((exists) => {
  //         if (exists) {
  //           this.userState = 'verified';
  //         } else {
  //           this.userState = 'none';
  //         }
  //       }),
  //       catchError((err) => {
  //         this.userState = 'none';
  //         return throwError(err);
  //       })
  //     )
  //     .subscribe();
  // }

  // public reload() {
  //   this.club = this.drs.syncedClubs.get(this.clubId);
  // }
  // public saveClub() {
  //   this.ns.showToast('Fehler beim speichern.');
  // }

  // public async addAdmin() {
  //   /** :
  //    *
  //    * TODO: - check if user is already admin
  //    * TODO: - write to clubData: Normal firestore update
  //    * TODO: - write to userData: cloudFunction
  //    */
  //   if (this.addAdminGroup.valid) {
  //     if (
  //       this.drs.syncedClubs.get(this.clubId).clubData.users[this.addAdminGroup.value.uid] ===
  //       'admin'
  //     ) {
  //       this.ns.showToast('Benutzer ist bereits Admin.');
  //     }
  //     if (
  //       this.drs.syncedClubs.get(this.clubId).clubData.users[this.addAdminGroup.value.uid] ===
  //       'owner'
  //     ) {
  //       this.ns.showToast('Benutzer ist bereits Besitzer.');
  //     }
  //     if (
  //       this.drs.syncedClubs.get(this.clubId).clubData.users[this.addAdminGroup.value.uid] ===
  //       undefined
  //     ) {
  //       this.drs
  //         .addAdminToClub(
  //           this.clubId,
  //           this.addAdminGroup.value.uid,
  //           this.addAdminGroup.value.name,
  //           this.club.name
  //         )
  //         .then(() => {
  //           this.ns.showToast('Benutzer wurde hinzugefügt.');
  //           this.admins.push(this.addAdminGroup.value);
  //         });
  //     }
  //   }
  // }
}
