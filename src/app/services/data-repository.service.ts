import { Injectable } from '@angular/core';
import { Team, TeamData } from '../classes/team';
import { Club, ClubData } from '../classes/club';
import { Meet, userMeetStatus } from '../classes/meet';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';
import { SessionUserData } from '../classes/session-user-data';
import { filter, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class DataRepositoryService {
  constructor(private afs: AngularFirestore) {}

  /**
   *  Read behaviorsubs for incoming data from firestore
   *  @since 2.0.0
   */
  private _clubs: BehaviorSubject<Club[]> = new BehaviorSubject([]);
  private _teams: BehaviorSubject<Team[]> = new BehaviorSubject([]);
  private _meets: BehaviorSubject<Meet[]> = new BehaviorSubject([]);
  private _authUser: BehaviorSubject<AuthUserData[]> = new BehaviorSubject([]);
  private _sessionUser: BehaviorSubject<SessionUserData[][]> = new BehaviorSubject([]);

  /** UID-Maps for keeping track of the indexes in the array
   *  @since 2.0.0
   */
  private _clubsMap: Map<string, number> = new Map();
  private _teamsMap: Map<string, number> = new Map();
  private _meetsMap: Map<string, number> = new Map();
  private _authUserMap: Map<string, number> = new Map();
  private _sessionUserMap: Map<string, number> = new Map();

  /**
   * UID storages for deciding if a new onSpnapshot listener should be added or not
   * @since 2.0.0
   */
  private _clubsUids: string[] = [];
  private _teamUids: string[] = [];
  private _meetUids: string[] = [];
  private _authUserUids: string[] = [];
  private _sessionUserUids: string[] = [];

  /**
   *  Gets clubs from firestore
   *  Subscribes to valueChanges() of a club, and pushes the data to the _clubs BehaviorSubject and saves the index in the uid map
   *  @since 2.0.0
   *  @memberof DataRepositoryService
   *
   *  @param {string} uid
   *  @returns {Club}
   */
  async syncClub(uid: string) {
    if (!this._clubsUids.includes(uid)) {
      this._clubsUids.push(uid);
      this.afs
        .collection(this.CollectionWithConverter('clubs', Club.converter))
        .doc<Club>(uid)
        .valueChanges()
        .subscribe((club) => {
          if (club) {
            console.log('[ Club valueChanged ]', club);
            const index = this._clubsMap.get(uid);
            if (index !== undefined) {
              this._clubs.value[index] = club;
            } else {
              this._clubs.next([...this._clubs.value, club]);
              this._clubsMap.set(uid, this._clubs.value.length - 1);
            }
          }
        });
    }
    return await new Promise<Club>((resolve) => {
      this._clubs.toPromise().then((clubs) => {
        resolve(clubs[this._clubsMap.get(uid)]);
      });
    });
  }

  /**
   * Gets teams from firestore
   * Subscribes to valueChanges() of a team, and pushes the data to the _teams BehaviorSubject and saves the index in the uid map
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} uid
   * @param {string} clubId
   * @returns {void}
   */
  async syncTeam(uid: string, clubId: string) {
    if (!this._teamUids.includes(uid)) {
      this._teamUids.push(uid);
      this.afs
        .collection(this.CollectionWithConverter(`clubs/${clubId}/teams`, Team.converter))
        .doc<Team>(uid)
        .valueChanges()
        .subscribe((team) => {
          if (team) {
            console.log('[ Team valueChanged ]', team);
            var key = `${clubId}:${uid}`;
            const index = this._teamsMap.get(key);
            if (index !== undefined) {
              this._teams.value[index] = team;
            } else {
              this._teams.next([...this._teams.value, team]);
              this._teamsMap.set(key, this._teams.value.length - 1);
            }
          }
        });
    }
    return await new Promise<Team>((resolve) => {
      this._teams.toPromise().then((teams) => {
        resolve(teams[this._teamsMap.get(uid)]);
      });
    });
  }

  /**
   * Gets meets from firestore
   * Subscribes to valueChanges() of a meet, and pushes the data to the _meets BehaviorSubject and saves the index in the uid map
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} uid
   * @returns {Meet}
   * @param {string} clubId
   * @param {string} teamId
   *
   */
  async syncMeet(uid: string, clubId: string, teamId: string) {
    if (!this._meetUids.includes(uid)) {
      this._meetUids.push(uid);
      this.afs
        .collection(
          this.CollectionWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter)
        )
        .doc<Meet>(uid)
        .valueChanges()
        .subscribe((meet) => {
          if (meet) {
            console.log('[ Meet valueChanged ]', meet);
            var key = `${clubId}:${teamId}:${uid}`;
            const index = this._meetsMap.get(key);
            if (index !== undefined) {
              this._meets.value[index] = meet;
            } else {
              this._meets.next([...this._meets.value, meet]);
              this._meetsMap.set(key, this._meets.value.length - 1);
            }
            console.log(this._meetsMap);
          }
        });
    }
    return await new Promise<Meet>((resolve) => {
      this._meets.toPromise().then((meets) => {
        resolve(meets[this._meetsMap.get(uid)]);
      });
    });
  }

  /**
   * Gets authUser from firestore
   * Subscribes to valueChanges() of a authUser, and pushes the data to the _authUser BehaviorSubject and saves the index in the uid map
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} uid
   * @returns {Promise<AuthUserData>}
   *
   */
  syncAuthUser(uid: string) {
    if (!this._authUserUids.includes(uid)) {
      this._authUserUids.push(uid);
      this.afs
        .collection(this.CollectionWithConverter('authUsers', AuthUserData.converter))
        .doc<AuthUserData>(uid)
        .valueChanges()
        .subscribe((authUser) => {
          if (authUser) {
            console.log('[ AuthUser valueChanged ]', authUser);
            const index = this._authUserMap.get(uid);
            if (index !== undefined) {
              this._authUser.value[index] = authUser;
            } else {
              this._authUser.next([...this._authUser.value, authUser]);
              this._authUserMap.set(uid, this._authUser.value.length - 1);
            }
          }
        });
    }
    return new Promise<AuthUserData>((resolve) => {
      this._authUser.toPromise().then((authUser) => {
        resolve(authUser[this._authUserMap.get(uid)]);
      });
    });
  }

  /**
   * Gets all sessionUsers for a user from firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   *
   * @param {string} uid
   * @returns {Promise<SessionUserData[]>}
   */
  async syncSessionUsers(uid: string) {
    if (this._sessionUserUids.includes(uid)) {
      return await new Promise<SessionUserData[]>((resolve) => {
        this._sessionUser.toPromise().then((sessionUsers) => {
          resolve(sessionUsers[this._sessionUserMap.get(uid)]);
        });
      });
    } else {
      this._sessionUserUids.push(uid);
      let unsubscribe = this.afs
        .collection(this.CollectionWithConverter(`sessionUsers`, SessionUserData.converter))
        .ref.where('owner', '==', uid)
        .onSnapshot(
          (querySnapshot) => {
            var sessionUsers: SessionUserData[][] = [[]];
            querySnapshot.forEach((doc) => {
              let data = doc.data() as SessionUserData;
              sessionUsers[0].push(data);
            });
            if (this._sessionUserMap.get(uid) === undefined) {
              this._sessionUser.next([...this._sessionUser.value, ...sessionUsers]);
              this._sessionUserMap.set(uid, this._sessionUser.value.length - 1);
            } else {
              let index = this._sessionUserMap.get(uid);
              this._sessionUser.value[index] = sessionUsers[0];
            }
            console.log('[ SessionUsers valueChanged ]', sessionUsers);
          },
          (error) => {
            console.log('[ SessionUsers error ]', error);
          }
        );

      return await new Promise<SessionUserData[]>((resolve) => {
        this._sessionUser.toPromise().then((sessionUsers) => {
          resolve(sessionUsers[this._sessionUserMap.get(uid)]);
        });
      });
    }
  }
  // MARK: - Create
  /**
   * Creates a new club in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {Club} club
   *
   * @returns {Promise<void>}
   */
  async createClub(club: Club, uid: string) {
    return await this.afs
      .collection(this.CollectionWithConverter('clubs', Club.converter))
      .add(club)
      .then((ref) => {
        this.syncClub(ref.id);
      });
  }
  /**
   * Creates a new team in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {Team} team
   * @param {string} clubId
   * @returns {Promise<void>}
   */
  async createTeam(team: Team, clubId: string) {
    return await this.afs
      .collection(this.CollectionWithConverter(`clubs/${clubId}/teams`, Team.converter))
      .add(team)
      .then((ref) => {
        this.syncTeam(ref.id, clubId);
      });
  }
  /**
   * Creates a new meet in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {Meet} meet
   * @param {string} clubId
   * @param {string} teamId
   * @returns {Promise<void>}
   */
  async createMeet(meet: Meet, clubId: string, teamId: string) {
    return await this.afs
      .collection(
        this.CollectionWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter)
      )
      .add(meet)
      .then((ref) => {
        this.syncMeet(ref.id, clubId, teamId);
      });
  }
  /**
   * Creates a new sessionUser in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {SessionUserData} sessionUser
   * @param {string} uid
   * @returns {Promise<void>}
   *
   */
  async createSessionUser(sessionUser: SessionUserData, uid: string) {
    sessionUser.owner = uid;
    return await this.afs
      .collection(this.CollectionWithConverter('sessionUsers', SessionUserData.converter))
      .add(sessionUser)
      .then((ref) => {
        this.syncSessionUsers(uid);
      });
  }
  /**
   * Creates a new authUser in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {AuthUserData} authUser
   * @returns {Promise<string>}
   */
  createAuthUser(authUser: AuthUserData, uid: string) {
    return new Promise<string>((resolve) => {
      this.afs
        .collection(this.CollectionWithConverter('authUsers', AuthUserData.converter))
        .doc(uid)
        .set(authUser)
        .then((ref) => {
          this.syncAuthUser(uid);
          resolve(uid);
        });
    });
  }
  // MARK: - Update
  /**
   * Updates a club in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {Club} club
   * @param {string} clubId
   * @returns {Promise<void>}
   */
  async updateClub(club: Club, clubId: string) {
    return await this.afs
      .collection(this.CollectionWithConverter('clubs', Club.converter))
      .doc(clubId)
      .update(club)
      .then(() => {
        this.syncClub(clubId);
      });
  }
  /**
   * Updates a team in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {Team} team
   * @param {string} clubId
   * @param {string} teamId
   * @returns {Promise<void>}
   */
  async updateTeam(team: Team, clubId: string, teamId: string) {
    return await this.afs
      .collection(this.CollectionWithConverter(`clubs/${clubId}/teams`, Team.converter))
      .doc(teamId)
      .update(team)
      .then(() => {
        this.syncTeam(teamId, clubId);
      });
  }
  /**
   * Updates a meet in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {Meet} meet
   * @param {string} clubId
   * @param {string} teamId
   * @param {string} meetId
   * @returns {Promise<void>}
   */
  async updateMeet(meet: Meet, clubId: string, teamId: string, meetId: string) {
    return await this.afs
      .collection(
        this.CollectionWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter)
      )
      .doc(meetId)
      .update(meet)
      .then(() => {
        this.syncMeet(meetId, clubId, teamId);
      });
  }
  /**
   * Updates a sessionUser in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {SessionUserData} sessionUser
   * @param {string} uid
   * @param {string} sessionUserId
   * @returns {Promise<void>}
   */
  async updateSessionUser(sessionUser: SessionUserData, uid: string, sessionUserId: string) {
    return await this.afs
      .collection(this.CollectionWithConverter('sessionUsers', SessionUserData.converter))
      .doc(sessionUserId)
      .update(sessionUser)
      .then(() => {
        this.syncSessionUsers(uid);
      });
  }
  /**
   * Updates a authUser in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {AuthUserData} authUser
   * @param {string} authUserId
   * @returns {Promise<void>}
   */
  async updateAuthUser(authUser: AuthUserData, authUserId: string) {
    return await this.afs
      .collection(this.CollectionWithConverter('authUsers', AuthUserData.converter))
      .doc(authUserId)
      .update(authUser)
      .then(() => {
        this.syncAuthUser(authUserId);
      });
  }
  // MARK: - Delete
  /**
   * Deletes a club in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} clubId
   * @returns {Promise<void>}
   */
  async deleteClub(clubId: string) {
    return await this.afs
      .collection(this.CollectionWithConverter('clubs', Club.converter))
      .doc(clubId)
      .delete();
  }
  /**
   * Deletes a team in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} clubId
   * @param {string} teamId
   * @returns {Promise<void>}
   */
  async deleteTeam(clubId: string, teamId: string) {
    return await this.afs
      .collection(this.CollectionWithConverter(`clubs/${clubId}/teams`, Team.converter))
      .doc(teamId)
      .delete();
  }
  /**
   * Deletes a meet in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} clubId
   * @param {string} teamId
   * @param {string} meetId
   * @returns {Promise<void>}
   */
  async deleteMeet(clubId: string, teamId: string, meetId: string) {
    return await this.afs
      .collection(
        this.CollectionWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter)
      )
      .doc(meetId)
      .delete();
  }
  /**
   * Deletes a sessionUser in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} sessionUserId
   * @returns {Promise<void>}
   */
  async deleteSessionUser(sessionUserId: string) {
    return await this.afs
      .collection(this.CollectionWithConverter('sessionUsers', SessionUserData.converter))
      .doc(sessionUserId)
      .delete();
  }
  /**
   * Deletes a authUser in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} authUserId
   * @returns {Promise<void>}
   */
  async deleteAuthUser(authUserId: string) {
    console.warn(
      'You just ACTUALLY broke the internet. (Or at least this service) please call support, I beg you.'
    );
    return await this.afs
      .collection(this.CollectionWithConverter('authUsers', AuthUserData.converter))
      .doc(authUserId)
      .delete();
  }

  // MARK: Getters

  get clubs() {
    return this._clubs;
  }
  get teams() {
    return this._teams;
  }
  get meets() {
    return this._meets;
  }
  get sessionUsers() {
    return this._sessionUser;
  }
  get authUsers() {
    return this._authUser;
  }
  set clubs(clubs: BehaviorSubject<Club[]>) {
    throw new Error('You can not set clubs');
  }
  set teams(teams: BehaviorSubject<Team[]>) {
    throw new Error('You can not set teams');
  }
  set meets(meets: BehaviorSubject<Meet[]>) {
    throw new Error('You can not set meets');
  }
  set sessionUsers(sessionUsers: BehaviorSubject<SessionUserData[][]>) {
    throw new Error('You can not set sessionUsers');
  }
  set authUsers(authUsers: BehaviorSubject<AuthUserData[]>) {
    throw new Error('You can not set authUsers');
  }

  // MARK: Dynamic observers

  /**
   * Sync a club and subscribe to changes
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} clubId The id of the club to listen to
   * @returns {Observable<Club>}
   */
  getClub(clubId: string) {
    this.syncClub(clubId);
    // pipe internal clubs to an observable containing the club of type Observable<Club>
    return this._clubs.pipe(
      map((clubs: Club[]) => {
        return clubs.find((club: Club) => club.uid === clubId);
      })
    );
  }
  /**
   * Sync a team and subscribe to changes
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} teamId The id of the team to listen to
   * @param {string} clubId The id of the club the team belongs to
   * @returns {Observable<Team>}
   */
  getTeam(teamId: string, clubId: string) {
    this.syncTeam(teamId, clubId);
    // pipe internal teams to an observable containing the team of type Observable<Team>
    return this._teams.pipe(
      map((teams: Team[]) => {
        return teams.find((team: Team) => team.uid === teamId);
      })
    );
  }

  // HELPERS
  CollectionWithConverter(path: string, converter: any) {
    return this.afs.firestore.collection(path).withConverter(converter);
  }
}
