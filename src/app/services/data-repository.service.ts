import { Injectable } from '@angular/core';
import { Team, TeamData } from '../classes/team';
import { Club, ClubData } from '../classes/club';
import { Meet } from '../classes/meet';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUserData } from '../classes/auth-user-data';
import { MemberUserData } from '../classes/member-user-data';

@Injectable({
  providedIn: 'root',
})
export class DataRepositoryService {
  syncedClubs: BehaviorSubject<Club>[] = [];
  syncedTeams: BehaviorSubject<Team>[] = [];
  syncedMeets: BehaviorSubject<Meet>[] = [];
  syncedClubData: BehaviorSubject<ClubData>[] = [];
  syncedTeamData: BehaviorSubject<TeamData>[] = [];

  currentUser: BehaviorSubject<AuthUserData> = new BehaviorSubject<AuthUserData>(null);
  currentMemberships: MemberUserData[] = [];

  constructor(private afs: AngularFirestore) {}

  // high level primitives
  async prepareSessionForUser() {
    console.log(
      '[ 📲 data repository ]',
      'started loading all session data for authenticated user.'
    );
    if (this.currentUser.getValue()) {
      console.log(
        '[ 📲 data repository ]',
        `loading ${this.currentUser.getValue().memberships.length} memberships.`
      );
      if (this.currentUser.getValue().memberships.length > 0) {
        await this.currentUser.getValue().memberships.forEach(async (membership) => {
          this.currentMemberships.push(await this.getMembershipData(membership));
        });
      }
    }
  }

  prepareSessionForMembership(membership: string) {
    console.log('[ 📲 data repository ]', 'started loading all session data for membership');
  }

  async getUserData(uid: string) {
    return (await (
      await this.afs
        .collection(this.getCollectionRefWithConverter('users', AuthUserData.converter))
        .doc(uid)
        .get()
        .toPromise()
    ).data()) as AuthUserData;
  }
  async addUser(data: AuthUserData) {
    this.afs
      .collection(this.getCollectionRefWithConverter('users', AuthUserData.converter))
      .doc(data.uid)
      .set(data);
  }
  async getMembershipData(uid: string) {
    return (await (
      await this.afs
        .collection(this.getCollectionRefWithConverter('memberships', MemberUserData.converter))
        .doc(uid)
        .get()
        .toPromise()
    ).data()) as MemberUserData;
  }
  async kickstartPostLogin() {
    this.prepareSessionForUser();
  }

  getDocumentRefWithConverterFromRef(documentReference: DocumentReference, converter: any) {
    return this.afs.firestore.doc(documentReference.path).withConverter(converter);
  }
  getDocumentRefWithConverterFromPath(path: string, converter: any) {
    return this.afs.firestore.doc(path).withConverter(converter);
  }
  getCollectionRefWithConverter(path: string, converter: any) {
    return this.afs.firestore.collection(path).withConverter(converter);
  }
}

// structure was drawn on paper :(
