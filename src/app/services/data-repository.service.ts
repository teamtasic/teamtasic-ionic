import { Injectable } from '@angular/core';
import { Team } from '../classes/team';
import { Club } from '../classes/club';
import { Meet } from '../classes/meet';
import {
  AngularFirestore,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';
import {
  SessionUserData,
  sessionMembership,
  joinableMembership,
} from '../classes/session-user-data';
import { filter, map } from 'rxjs/operators';
import * as fb from 'firebase';
@Injectable({
  providedIn: 'root',
})
export class DataRepositoryService {
  constructor(private afs: AngularFirestore) {}

  /**
   *  Read behaviorsubs for incoming data from firestore
   *  @since 2.0.0
   */
  private _clubs: BehaviorSubject<Club[]> = new BehaviorSubject([] as Club[]);
  private _teams: BehaviorSubject<Team[]> = new BehaviorSubject([] as Team[]);
  private _meets: BehaviorSubject<Meet[]> = new BehaviorSubject([] as Meet[]);
  private _authUser: BehaviorSubject<AuthUserData[]> = new BehaviorSubject([] as AuthUserData[]);
  private _sessionUser: BehaviorSubject<SessionUserData[][]> = new BehaviorSubject(
    [] as SessionUserData[][]
  );
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
    return await new Promise<Club>((resolve) => {
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
                let cs = this._clubs.value;
                cs[index] = club;
                this._clubs.next(cs);
              } else {
                this._clubs.next([...this._clubs.value, club]);
                this._clubsMap.set(uid, this._clubs.value.length - 1);
              }
            }
            resolve(club as Club);
          });
      }
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
              let ts = this._teams.value;
              ts[index] = team;
              this._teams.next(ts);
            } else {
              this._teams.next([...this._teams.value, team]);
              this._teamsMap.set(key, this._teams.value.length - 1);
            }
          }
        });
    }
    return await new Promise<Team>((resolve) => {
      this._teams.toPromise().then((teams) => {
        resolve(teams[this._teamsMap.get(uid) as number]);
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
              let ms = this._meets.value;
              ms[index] = meet;
              this._meets.next(ms);
            } else {
              this._meets.next([...this._meets.value, meet]);
              this._meetsMap.set(key, this._meets.value.length - 1);
            }
          }
        });
    }
    return await new Promise<Meet>((resolve) => {
      this._meets.toPromise().then((meets) => {
        resolve(meets[this._meetsMap.get(uid) as number]);
      });
    });
  }

  /**
   * Gets authUser from firestore
   * Subscribes to valueChanges() of a authUser, and pushes the data to the _authUser BehaviorSubject and saves the index in the uid map
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} uid
   * @returns {Promise<void>}
   *
   */
  async syncAuthUser(uid: string) {
    if (!this._authUserUids.includes(uid)) {
      this._authUserUids.push(uid);
      await new Promise((resolve) => {
        this.afs
          .collection(this.CollectionWithConverter('authUsers', AuthUserData.converter))
          .doc<AuthUserData>(uid)
          .valueChanges()
          .subscribe((authUser) => {
            if (authUser) {
              console.log('[ AuthUser valueChanged ]', authUser);
              const index = this._authUserMap.get(uid);
              if (index !== undefined) {
                let old = this._authUser.value;
                old[index] = authUser;
                this._authUser.next(old);
              } else {
                let old = this._authUser.value;
                old.push(authUser);
                console.log(old);
                this._authUser.next(old);
                console.log(this._authUser.value);
                this._authUserMap.set(uid, this._authUser.value.length - 1);
              }
              resolve(undefined);
            }
          });
      });
    }
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
          resolve(sessionUsers[this._sessionUserMap.get(uid) as number]);
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
              let index = this._sessionUserMap.get(uid) as number;
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
          resolve(sessionUsers[this._sessionUserMap.get(uid) as number]);
        });
      });
    }
  }
  /** get all sessionMembership s for a sessionuser
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} sessionUserId
   * @return {Promise<sessionMembership[]>}
   */
  async syncSessionMemberships(sessionUserId: string) {
    return await new Promise<sessionMembership[]>((resolve) => {
      let query = this.afs.collectionGroup<Object>('teams', (ref) =>
        ref.where('users', 'array-contains', sessionUserId)
      );
      query
        .get()
        .toPromise()
        .then((sessionMemberships) => {
          console.log('[ SessionMemberships valueChanged ]', sessionMemberships);
          let rval: any[] = [];
          sessionMemberships.forEach((doc) => {
            let team = doc.data() as Team;
            let membership: sessionMembership = {
              userId: sessionUserId,
              clubId: doc.ref.parent.parent?.id || '',
              teamId: doc.ref.id,
              displayName: team.name,
              role: 'member',
            };
            console.log('Found Membership in Team: ', team);

            if (team.users.includes(sessionUserId)) {
              membership.role = 'member';
            }
            if (team.trainers.includes(sessionUserId)) {
              membership.role = 'coach';
            }
            if (team.headTrainers.includes(sessionUserId)) {
              membership.role = 'headcoach';
            }
            if (team.admins.includes(sessionUserId)) {
              membership.role = 'admin';
            }
            rval.push(membership);
          });
          resolve(rval);
        });
    });
  }
  /**
   * Sync a auth Users join code
   * @since 2.4.0
   * @memberof DataRepositoryService
   * @param {string} sessionUserId
   * @return {Promise<joinableMembership>}
   */
  async syncSessionJoinCode(sessionUserId: string) {
    return await new Promise<joinableMembership | undefined>((resolve) => {
      // get join code
      this.afs
        .collection(this.CollectionWithConverter('authUsers', AuthUserData.converter))
        .doc(sessionUserId)
        .get()
        .toPromise()
        .then((doc) => {
          let data = doc.data() as AuthUserData;
          if (data && data.joinCode != '') {
            this.afs
              .collection('joinCodes')
              .doc(data.joinCode)
              .get()
              .toPromise()
              .then((doc) => {
                if (doc.exists) {
                  var code = doc.data() as {
                    teamId: string;
                    clubId: string;
                    code: string;
                    role: 'coach' | 'headcoach' | 'member';
                  };
                  code['code'] = doc.ref.id as string;
                  console.log(code['teamId']);
                  this.getTeam(code['teamId'], code['clubId']).then((team) => {
                    resolve({
                      teamId: team.uid,
                      clubId: team.owner,
                      displayName: team.name,
                      code: code.code,
                      role: code.role,
                    } as joinableMembership);
                  });
                } else {
                  console.log('[ JoinCode not found ]', doc);
                }
              });
          } else {
            resolve(undefined);
          }
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
  async createClub(club: Club) {
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
   * @param {string} ownerUid
   * @returns {Promise<void>}
   *
   */
  async createSessionUser(sessionUser: SessionUserData, ownerUid: string) {
    sessionUser.owner = ownerUid;
    return await this.afs
      .collection(this.CollectionWithConverter('sessionUsers', SessionUserData.converter))
      .add(sessionUser)
      .then((ref) => {
        this.syncSessionUsers(ownerUid);
      });
  }
  /**
   * Creates a new authUser in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {AuthUserData} authUser
   * @param {string} uid
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
      .set(team)
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
      .set(meet)
      .then(() => {
        this.syncMeet(meetId, clubId, teamId);
      });
  }
  /** update meet status in firestore
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} clubId
   * @param {string} teamId
   * @param {string} meetId
   * @param {string} status
   * @param {string} sessionId
   * @param {string} comment
   * @param {string} deadline
   * @param {string} meetpoint
   * @returns {Promise<void>}
   */
  async updateMeetStatus(
    clubId: string,
    teamId: string,
    meetId: string,
    status: 'accepted' | 'declined' | 'unknown',
    sessionId: string,
    comment: string,
    deadline: number,
    meetpoint: string,
    comments: {}
  ) {
    await this.afs
      .collection(`clubs/${clubId}/teams/${teamId}/meets/`)
      .doc(meetId)
      .update({
        acceptedUsers:
          status == 'accepted'
            ? fb.default.firestore.FieldValue.arrayUnion(sessionId)
            : fb.default.firestore.FieldValue.arrayRemove(sessionId),
        declinedUsers:
          status == 'declined'
            ? fb.default.firestore.FieldValue.arrayUnion(sessionId)
            : fb.default.firestore.FieldValue.arrayRemove(sessionId),
        comment: comment,
        deadline: deadline,
        meetpoint: meetpoint,
        comments: comments,
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
      .set(sessionUser)
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
      .set(authUser)
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
   * @returns {Promise<Team>}
   */
  getTeam(teamId: string, clubId: string) {
    return new Promise<Team>((resolve, reject) => {
      this.afs
        .collection(this.CollectionWithConverter(`clubs/${clubId}/teams`, Team.converter))
        .doc<Team>(teamId)
        .get()
        .toPromise()
        .then((doc: any) => {
          if (doc.exists) {
            resolve(doc.data() as Team);
          } else {
            reject(new Error('Team does not exist'));
          }
        });
    });
  }

  /**
   * Get all clubs relevant for a admin
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} - adminId The id of the admin
   * @returns {string[]} - The ids of the clubs
   */
  getClubsForAdmin(adminId: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.afs
        .collection(this.CollectionWithConverter('clubs', Club.converter))
        .ref.where('admins', 'array-contains', adminId)
        .get()
        .then((querySnapshot: QuerySnapshot<Club> | any) => {
          console.log(querySnapshot);
          resolve(querySnapshot.docs.map((doc: DocumentSnapshot<Club>) => doc.id));
        });
    });
  }

  /**
   * Get all teams for a club (field 'owner')
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} clubId The id of the club
   * @returns {string[]} The ids of the teams
   *
   */
  getTeamsForClub(clubId: string) {
    return new Promise((resolve, reject) => {
      this.afs
        .collection(this.CollectionWithConverter(`clubs/${clubId}/teams`, Team.converter))
        .valueChanges()
        .subscribe((querySnapshot) => {
          var res: Team[] = [];
          querySnapshot.forEach((team: Team | any) => {
            if (team) {
              res.push(team);
              console.log('[ Team valueChanged ]', team);
              var key = `${clubId}:${team.uid}`;
              const index = this._teamsMap.get(key);
              if (index !== undefined) {
                this._teams.value[index] = team;
              } else {
                this._teams.next([...this._teams.value, team]);
                this._teamsMap.set(key, this._teams.value.length - 1);
              }
            }
          });
          resolve(res);
        });
    });
  }
  // if(team) {
  //   console.log('[ Team valueChanged ]', team);
  //   var key = `${clubId}:${uid}`;
  //   const index = this._teamsMap.get(key);
  //   if (index !== undefined) {
  //     this._teams.value[index] = team;
  //   } else {
  //     this._teams.next([...this._teams.value, team]);
  //     this._teamsMap.set(key, this._teams.value.length - 1);
  //   }
  // }
  /**
   * Get all teams for a sessionUser Id using a collectionGroup query
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} sessionUserId The id of the sessionUser
   * @returns {string[]} The ids of the teams
   */
  async getTeamsForSessionUser(sessionUserId: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.afs
        .collectionGroup('teams', (ref) =>
          ref.where('sessionUsers', 'array-contains', sessionUserId)
        )
        .get()
        .toPromise()
        .then((querySnapshot: QuerySnapshot<Team> | any) => {
          resolve(querySnapshot.docs.map((doc: DocumentSnapshot<Team>) => doc.id));
        });
    });
  }

  /**
   * Get all meets for a team
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} teamId The id of the team
   * @param {string} clubId The id of the club the team belongs to
   * @returns {string[]} The ids of the meets
   */
  async getMeetsForTeam(teamId: string, clubId: string): Promise<string[]> {
    return this.afs
      .collection(
        this.CollectionWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter)
      )
      .ref.get()
      .then((querySnapshot: QuerySnapshot<Meet> | any) => {
        return querySnapshot.docs.map((doc: DocumentSnapshot<Meet>) => doc.id);
      });
  }
  /** Gets an behavior subject of all meets for a team
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} teamId The id of the team
   * @param {string} clubId The id of the club the team belongs to
   * @returns {Meet[]} The ids of the meets
   */
  syncMeetsForTeam(teamId: string, clubId: string): Observable<Meet[]> {
    return this.afs
      .collection<Meet>(
        this.CollectionWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter)
      )
      .valueChanges();
  }

  /**
   * Check if a auth user exists
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} authUserId The id of the auth user
   * @returns {boolean} True if the auth user exists
   */
  authUserExists(authUserId: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.afs
        .collection(this.CollectionWithConverter('authUsers', AuthUserData.converter))
        .ref.doc(authUserId)
        .get()
        .then((doc: DocumentSnapshot<AuthUserData> | any) => {
          resolve(doc.exists);
        });
    });
  }

  /** checks if a joinCode exists for a team, and returns the code
   * @since 2.0.0
   * @memberof DataRepositoryService
   * @param {string} teamId The id of the team
   * @param {string} clubId The id of the club the team belongs to
   * @param {string} role The role of the joinCode
   * @returns {string} The joinCode
   * @throws {Error} If the joinCode does not exist
   */
  getJoinCodeForTeam(
    teamId: string,
    clubId: string,
    role: 'admin' | 'headcoach' | 'coach' | 'member'
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.afs
        .collection('joinCodes')
        .ref.where('teamId', '==', teamId)
        .where('clubId', '==', clubId)
        .where('role', '==', role)
        .limit(1)
        .get()
        .then((querySnapshot: QuerySnapshot<Object> | any) => {
          if (querySnapshot.docs.length == 1) {
            console.log('[ JoinCode ]', querySnapshot.docs[0].data(), querySnapshot.docs[0].id);
            resolve(querySnapshot.docs[0].id);
          } else {
            reject(new Error(`Join code for team ${teamId} not found`));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /** get session user from afs
   * @since 2.1.1
   * @memberof DataRepositoryService
   * @param {string} sessionUserId The id of the session user
   * @returns {Promise<SessionUserData>} The session user
   */
  getSessionUser(sessionUserId: string): Promise<SessionUserData> {
    return new Promise<SessionUserData>((resolve, reject) => {
      this.afs
        .collection(this.CollectionWithConverter('sessionUsers', SessionUserData.converter))
        .doc(sessionUserId)
        .get()
        .toPromise()
        .then((doc: any | DocumentSnapshot<SessionUserData>) => {
          if (doc.exists) {
            resolve(doc.data() as SessionUserData);
          } else {
            reject(new Error(`Session user ${sessionUserId} not found`));
          }
        });
    });
  }

  /** resets drs after logout */
  reset() {
    this._clubs.next([]);
    this._clubsMap.clear();
    this._teams.next([]);
    this._teamsMap.clear();
    this._sessionUser.next([]);
    this._sessionUserMap.clear();
    this._authUser.next([]);
    this._authUserMap.clear();
    this._meets.next([]);
    this._meetsMap.clear();
    this._clubsUids = [];
    this._teamUids = [];
    this._sessionUserUids = [];
    this._authUserUids = [];
    this._meetUids = [];
  }

  /** checks if the club has a license
   * @since 2.4.0
   * @memberof DataRepositoryService
   * @param {string} clubId The id of the club
   * @returns {Promise<boolean>} True if the club has a license
   */
  hasLicense(clubId: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {});
  }

  // HELPERS
  CollectionWithConverter(path: string, converter: any) {
    return this.afs.firestore.collection(path).withConverter(converter);
  }
}
