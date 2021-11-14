import { Injectable } from '@angular/core';
import { Team, TeamData } from '../classes/team';
import { Club, ClubData } from '../classes/club';
import { Meet, userMeetStatus } from '../classes/meet';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';
import { SessionUserData } from '../classes/session-user-data';
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
   *  Gets clubs from firestore
   *  Subscribes to valueChanges() of a club, and pushes the data to the _clubs BehaviorSubject and saves the index in the uid map
   *  @since 2.0.0
   *  @memberof DataRepositoryService
   *
   *  @param {string} uid
   *  @returns {Club}
   */
  async syncClub(uid: string) {
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
    return this._authUser.toPromise();
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
  createAuthUser(authUser: AuthUserData) {
    return new Promise<string>((resolve) => {
      this.afs
        .collection(this.CollectionWithConverter('authUsers', AuthUserData.converter))
        .add(authUser)
        .then((ref) => {
          this.syncAuthUser(ref.id);
          resolve(ref.id);
        });
    });
  }
  // MARK: - Update

  // HELPERS
  CollectionWithConverter(path: string, converter: any) {
    return this.afs.firestore.collection(path).withConverter(converter);
  }
}
