import { Injectable } from '@angular/core';
import { Team, TeamData } from '../classes/team';
import { Club, ClubData } from '../classes/club';
import { Meet, userMeetStatus } from '../classes/meet';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';

import { UtilitysService } from './utilitys.service';
@Injectable({
  providedIn: 'root',
})
export class DataRepositoryService {
  constructor(private afs: AngularFirestore, private utils: UtilitysService) {}
}
