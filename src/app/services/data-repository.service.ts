import { Injectable } from '@angular/core';
import { Team, TeamData } from '../classes/team';
import { Club, ClubData } from '../classes/club';
import { Meet } from '../classes/meet';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';

@Injectable({
  providedIn: 'root',
})
export class DataRepositoryService {
  syncedClubs: Map<string, Club> = new Map<string, Club>();
  syncedTeams: Map<string, Team> = new Map<string, Team>();
  syncedMeets: Map<string, Meet> = new Map<string, Meet>();

  currentUser: BehaviorSubject<AuthUserData> = new BehaviorSubject<AuthUserData>(null);

  constructor(private afs: AngularFirestore) {}

  /**
   * after authentication, get the user data from firestore
   */
  async prepareSessionForUser() {
    console.log(
      '[ 📲 data repository ]',
      'started loading all session data for authenticated user.'
    );
    if (
      this.currentUser.getValue() &&
      Object.keys(this.currentUser.getValue().memberships).length > 0
    ) {
      console.log(
        '[ 📲 data repository ]',
        'memberships:',
        this.currentUser.getValue().memberships
      );
      for (let clubId in this.currentUser.getValue().memberships) {
        let c = await this.getClub(clubId);
        c.clubData = await this.getClubData(clubId);
        this.syncedClubs.set(clubId, c);
      }
      console.log('[ clubs ]', this.syncedClubs);
    }
  }
  /**
   * get user document from firestore
   * @param userId
   * @returns user document
   */
  async getUserData(uid: string) {
    return await new Promise<AuthUserData>((resolve, reject) => {
      this.afs
        .collection(this.getCollectionRefWithConverter('users', AuthUserData.converter))
        .doc(uid)
        .get()
        .toPromise()
        .then((data) => {
          const doc = data.data();
          console.log(doc);
          resolve(doc as AuthUserData);
        });
    });
  }
  /**
   * update user document in firestore from currentUser
   * @returns user document reference
   * @throws error if current user is undefined
   */
  async updateUser() {
    if (!this.currentUser.getValue()) {
      throw new Error('no current user');
    }
    const userRef = this.afs
      .collection(this.getCollectionRefWithConverter('users', AuthUserData.converter))
      .doc(this.currentUser.getValue().uid);
    await userRef.set(this.currentUser.getValue());
    return userRef;
  }

  /**
   * create a user document in firestore
   * @param userData
   * @returns user document reference
   * @throws error if user already exists
   */
  async addUser(data: AuthUserData) {
    const ref = this.afs
      .collection(this.getCollectionRefWithConverter('users', AuthUserData.converter))
      .doc(data.uid);
    if (
      await new Promise<Boolean>((resolve) => {
        ref
          .get()
          .toPromise()
          .then((doc) => resolve(doc.exists));
      })
    ) {
      throw new Error('user already exists');
    } else {
      ref
        .set(data)
        .then(() => {
          console.log('[ 📲 data repository ]', 'user added');
          return ref;
        })
        .catch((err) => {
          console.log('[ 📲 data repository ]', 'error adding user', err);
          return undefined;
        });
    }
  }

  async kickstartPostLogin() {
    this.prepareSessionForUser();
  }
  // create new club
  async createClub(club: Club, license: number) {
    const clubRef = this.afs
      .collection(this.getCollectionRefWithConverter('clubs', Club.converter))
      .doc();

    club.ref = clubRef.ref;
    club.uid = clubRef.ref.id;

    await clubRef.set(club);
    await this.createClubData(club, license);

    let user = this.currentUser.getValue();
    user.memberships[club.uid] = {
      role: 'owner',
      displayName: club.name,
      name: user.username,
      type: 'club',
    };
    this.currentUser.next(user);
    this.updateUser();
  }
  async writeClubData(clubData: ClubData) {
    const clubDataRef = this.afs.collection(
      this.getCollectionRefWithConverter(
        `clubs/${clubData.ref.parent.parent}/clubData/clubData`,
        ClubData.converter
      )
    );
  }
  async createClubData(club: Club, license: number) {
    console.log('license', license);
    const clubDataRef = this.afs
      .collection(
        this.getCollectionRefWithConverter(`clubs/${club.ref.id}/clubData/`, ClubData.converter)
      )
      .doc('clubData');
    if (!this.currentUser.getValue()) {
      throw new Error('no current user');
    }
    let users: Object = {
      [this.currentUser.getValue().uid]: {
        name: this.currentUser.getValue().username,
        role: 'owner',
      },
    };
    let clubData = new ClubData(clubDataRef.ref.id, clubDataRef.ref, users, license);

    await clubDataRef.set(clubData);
  }
  /**
   * get club document from firestore
   * @param clubId
   * @returns club document
   * @throws error if club does not exist
   */
  async getClub(clubId: string) {
    return await new Promise<Club>((resolve, reject) => {
      this.afs
        .collection(this.getCollectionRefWithConverter('clubs', Club.converter))
        .doc(clubId)
        .get()
        .toPromise()
        .then((data) => {
          const doc = data.data();
          if (doc) {
            resolve(doc as Club);
          } else {
            reject(new Error('club does not exist'));
          }
        });
    });
  }
  /**
   * get club data document from firestore
   * @param clubId
   * @returns club data document
   * @throws error if club does not exist
   * @throws error if club data does not exist
   */
  async getClubData(clubId: string) {
    return await new Promise<ClubData>((resolve, reject) => {
      this.afs
        .collection(
          this.getCollectionRefWithConverter(`clubs/${clubId}/clubData/`, ClubData.converter)
        )
        .doc('clubData')
        .get()
        .toPromise()
        .then((data) => {
          const doc = data.data();
          if (doc) {
            resolve(doc as ClubData);
          } else {
            reject(new Error('club data does not exist'));
          }
        });
    });
  }
  /**
   * update club document in firestore from index of syncedClubs
   * @returns club document reference
   * @params clubId
   * @throws error if club is undefined
   * @throws error if club data is undefined
   */
  async updateClub(clubId: string) {
    if (!this.syncedClubs[clubId]) {
      throw new Error('no club');
    }
    const clubRef = this.afs
      .collection(this.getCollectionRefWithConverter('clubs', Club.converter))
      .doc(clubId);
    await clubRef.set(this.syncedClubs[clubId]);
    return clubRef;
  }
  /**
   * create team document in firestore
   * @param team
   * @param clubId
   * @returns team document reference
   * @throws error if team already exists
   * @throws error if club does not exist
   */
  async addTeam(team: Team, clubId: string) {
    const teamRef = this.afs
      .collection(this.getCollectionRefWithConverter(`clubs/${clubId}/teams`, Team.converter))
      .doc();
    if (
      await new Promise<Boolean>((resolve) => {
        teamRef
          .get()
          .toPromise()
          .then((doc) => resolve(doc.exists));
      })
    ) {
      throw new Error('team already exists');
    } else {
      team.uid = teamRef.ref.id;
      await teamRef.set(team);
      return teamRef;
    }
  }
  /**
   * get team document from firestore
   * @param teamId
   * @param clubId
   * @returns team document
   * @throws error if team does not exist
   * @throws error if club does not exist
   */
  async getTeam(teamId: string, clubId: string) {
    return await new Promise<Team>((resolve, reject) => {
      this.afs
        .collection(this.getCollectionRefWithConverter(`clubs/${clubId}/teams`, Team.converter))
        .doc(teamId)
        .get()
        .toPromise()
        .then((data) => {
          const doc = data.data();
          if (doc) {
            resolve(doc as Team);
          } else {
            reject(new Error('team does not exist'));
          }
        });
    });
  }
  /**
   * update team document in firestore
   * @param teamId
   * @param clubId
   * @returns team document reference
   * @throws error if team does not exist
   * @throws error if club does not exist
   * @throws error if team is undefined
   * @throws error if team data is undefined
   */
  async updateTeam(teamId: string, clubId: string) {
    if (!this.syncedClubs[clubId].teams[teamId]) {
      throw new Error('no team');
    }
    const teamRef = this.afs
      .collection(this.getCollectionRefWithConverter(`clubs/${clubId}/teams`, Team.converter))
      .doc(teamId);
    await teamRef.set(this.syncedClubs[clubId].teams[teamId]);
    return teamRef;
  }
  /**
   * set team data document in firestore
   * @param teamId
   * @param clubId
   * @returns team data document reference
   */
  async setTeamData(teamId: string, clubId: string, teamData: TeamData) {
    const teamDataRef = this.afs
      .collection(
        this.getCollectionRefWithConverter(
          `clubs/${clubId}/teams/${teamId}/teamData`,
          TeamData.converter
        )
      )
      .doc('teamData');
    await teamDataRef.set(teamData);
    return teamDataRef;
  }
  /**
   * get team data document from firestore
   * @param teamId
   * @param clubId
   * @returns team data document
   * @throws error if team does not exist
   * @throws error if club does not exist
   */
  async getTeamData(teamId: string, clubId: string) {
    return await new Promise<TeamData>((resolve, reject) => {
      this.afs
        .collection(
          this.getCollectionRefWithConverter(
            `clubs/${clubId}/teams/${teamId}/teamData`,
            TeamData.converter
          )
        )
        .doc('teamData')
        .get()
        .toPromise()
        .then((data) => {
          const doc = data.data();
          if (doc) {
            resolve(doc as TeamData);
          } else {
            reject(new Error('team data does not exist'));
          }
        });
    });
  }

  getDocumentRefWithConverterFromPath(path: string, converter: any) {
    return this.afs.firestore.doc(path).withConverter(converter);
  }
  getCollectionRefWithConverter(path: string, converter: any) {
    return this.afs.firestore.collection(path).withConverter(converter);
  }
}

// structure was drawn on paper :(
