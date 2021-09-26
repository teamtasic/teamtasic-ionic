import { Injectable } from '@angular/core';
import { Team, TeamData } from '../classes/team';
import { Club, ClubData } from '../classes/club';
import { Meet, userMeetStatus } from '../classes/meet';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUserData } from '../classes/auth-user-data';

//! this is bad
import * as fb from 'firebase';
@Injectable({
  providedIn: 'root',
})
export class DataRepositoryService {
  syncedClubs: Map<string, Club> = new Map<string, Club>();
  needsUpdateUserData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUser: BehaviorSubject<AuthUserData> = new BehaviorSubject<AuthUserData>(null);

  hasPreloadedAfterLogin: boolean = false;

  constructor(private afs: AngularFirestore) {}

  /**
   * after authentication, get the user data from firestore
   */
  async prepareSessionForUser() {
    console.log(
      '[ 📲 data repository ]',
      'started loading all session data for authenticated user.'
    );
    if (this.currentUser.getValue() && this.currentUser.getValue().memberships.length > 0) {
      console.log(
        '[ 📲 data repository ]',
        'memberships:',
        this.currentUser.getValue().memberships
      );
      this.syncCurrentUser();
      this.hasPreloadedAfterLogin = true;
    }
  }
  /**
   * sync all clubs current user is member of from firestore
   * @returns void
   * @throws error if current user is undefined
   * @throws error if current user has no memberships
   * @throws error if club is not found in firestore
   */
  async syncCurrentUser() {
    if (!this.currentUser.getValue()) {
      throw new Error('no current user');
    }
    if (Object.keys(this.currentUser.getValue().memberships).length === 0) {
      throw new Error('no memberships');
    }

    // for (let clubId in this.currentUser.getValue().memberships) {
    //   if (this.currentUser.getValue().memberships[clubId].type === 'club') {
    //     let c = await this.getClub(clubId);
    //     c.clubData = await this.getClubData(clubId);
    //     this.syncedClubs.set(clubId, c);
    //     const d = await this.getTeams(clubId);
    //     for (let team of d) {
    //       team.teamData = await this.getTeamData(team.uid, clubId);
    //       this.syncedClubs.get(clubId).clubData.teams.set(team.uid, team);
    //     }
    //   }
    // }
    for (let memershipdIndex in this.currentUser.getValue().memberships) {
      if (this.currentUser.getValue().memberships[memershipdIndex]['type'] === 'club') {
        let clubId = this.currentUser.getValue().memberships[memershipdIndex]['club'];
        let c = await this.getClub(clubId);

        c.clubData = await this.getClubData(clubId);
        this.syncedClubs.set(clubId, c);
      }
    }
    for (let memershipdIndex in this.currentUser.getValue().memberships) {
      if (this.currentUser.getValue().memberships[memershipdIndex]['type'] === 'team') {
        console.log('memberships found: ');
        let teamId = this.currentUser.getValue().memberships[memershipdIndex]['team'];
        let clubId = this.currentUser.getValue().memberships[memershipdIndex]['club'];

        const team = await this.getTeam(teamId, clubId);

        team.teamData = await this.getTeamData(teamId, clubId);
        this.syncedClubs.get(clubId).clubData.teams.set(team.uid, team);
      }
    }

    console.log('[ clubs ]', this.syncedClubs);
  }
  /** sync all teams current user is member of from firestore
   * @returns void
   * @throws error if current user is undefined
   * @throws error if current user has no memberships
   * @throws error if team is not found in firestore
   */
  // async syncTeams() {
  //   if (!this.currentUser.getValue()) {
  //     throw new Error('no current user');
  //   }
  //   if (Object.keys(this.currentUser.getValue().memberships).length === 0) {
  //     throw new Error('no memberships');
  //   }
  //   for (let teamId in this.currentUser.getValue().memberships) {
  //     if (this.currentUser.getValue().memberships[teamId].type === 'team') {
  //       let t = await this.getTeam(teamId, this.currentUser.getValue().memberships[teamId].club);
  //       t.teamData = await this.getTeamData(
  //         teamId,
  //         this.currentUser.getValue().memberships[teamId].club
  //       );
  //       const clubId: string = t.ref.parent.parent.id;
  //       this.syncedTeams.set(teamId, t);

  //       let club = this.syncedClubs.get(clubId);
  //       console.log(club);
  //       club.clubData.teams.set(teamId, t);
  //       this.syncedClubs.set(clubId, club);
  //     }
  //   }
  //   console.log('[ teams ]', this.syncedTeams);
  // }
  /**
   * resync all clubs and team from firestore
   * @returns void
   * @throws error if current user is undefined
   */
  async resync() {
    if (!this.currentUser.getValue()) {
      throw new Error('no current user');
    }
    this.syncedClubs.clear();
    this.syncCurrentUser();

    this.needsUpdateUserData.next(true);
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
    user.memberships.push({
      role: 'owner',
      displayName: club.name,
      name: user.username,
      type: 'club',
      club: club.uid,
    });
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
    if (!this.syncedClubs.get(clubId)) {
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
            new Team(data.id, data.ref, (doc as Team).name);
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
    // if (!this.syncedClubs.get(clubId).clubData.teams[teamId]) {
    //   throw new Error('no team with id: ' + teamId + 'for club ' + clubId);
    // }
    const teamRef = this.afs
      .collection(this.getCollectionRefWithConverter(`clubs/${clubId}/teams`, Team.converter))
      .doc(teamId);
    await teamRef.set(this.syncedClubs.get(clubId).clubData.teams.get(teamId));
    return teamRef;
  }
  /**
   * delete team document from firestore
   * @param teamId
   * @param clubId
   * @returns team document reference
   */
  async deleteTeam(teamId: string, clubId: string) {
    const teamRef = this.afs
      .collection(this.getCollectionRefWithConverter(`clubs/${clubId}/teams`, Team.converter))
      .doc(teamId);
    await teamRef.delete();
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
            reject(new Error('team data does not exist. TEAM: ' + teamId + 'of CLUB: ' + clubId));
          }
        });
    });
  }
  /**
   * get all teams of a club from firestore
   * @param clubId
   * @returns array of team documents
   * @throws error if club does not exist
   */
  async getTeams(clubId: string) {
    return await new Promise<Team[]>((resolve, reject) => {
      this.afs
        .collection(this.getCollectionRefWithConverter(`clubs/${clubId}/teams`, Team.converter))
        .get()
        .toPromise()
        .then((data) => {
          const docs = data.docs;
          if (docs.length > 0) {
            resolve(
              docs.map((doc) => {
                return doc.data() as Team;
              })
            );
          } else {
            console.warn('no teams found');
            resolve([]);
          }
        });
    });
  }

  /**
   * checks if a user with uid exists in firestore
   * @param uid
   * @returns true if user exists or false if not
   */
  async userExists(uid: string) {
    return await new Promise<Boolean>((resolve) => {
      this.afs
        .collection('users')
        .doc(uid)
        .get()
        .toPromise()
        .then((data) => {
          resolve(data.exists);
        });
    });
  }

  /**
   * create meet document in firestore
   * @param meet
   * @param teamId
   * @param clubId
   * @returns meet document reference
   * @throws error if team does not exist
   * @throws error if club does not exist
   * @throws error if meet is undefined
   * @throws error if meet data is undefined
   */
  async createMeet(meet: Meet, teamId: string, clubId: string) {
    const meetRef = this.afs
      .collection(
        this.getCollectionRefWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter)
      )
      .doc();
    meet.uid = meetRef.ref.id;
    await meetRef.set(meet);
    return meetRef;
  }
  /**
   * get meet document from firestore
   * @param meetId
   * @param teamId
   * @param clubId
   * @returns meet document
   * @throws error if team does not exist
   * @throws error if club does not exist
   * @throws error if meet does not exist
   * @throws error if meet data is undefined
   */
  async getMeet(meetId: string, teamId: string, clubId: string) {
    return await new Promise<Meet>((resolve, reject) => {
      this.afs
        .collection(
          this.getCollectionRefWithConverter(
            `clubs/${clubId}/teams/${teamId}/meets`,
            Meet.converter
          )
        )
        .doc(meetId)
        .get()
        .toPromise()
        .then((data) => {
          const doc = data.data();
          if (doc) {
            resolve(doc as Meet);
          } else {
            reject(
              new Error(
                'meet does not exist. MEET: ' + meetId + 'of TEAM: ' + teamId + 'of CLUB: ' + clubId
              )
            );
          }
        });
    });
  }
  /**
   * get all meets of a team from firestore
   * @param teamId
   * @param clubId
   * @returns array of meet documents
   * @throws error if team does not exist
   * @throws error if club does not exist
   * @throws error if meets are undefined
   */
  async getMeets(
    teamId: string,
    clubId: string,
    start: number = 0,
    limit: number = 5,
    userId: string
  ) {
    return await new Promise<Meet[]>((resolve, reject) => {
      const ref = this.afs.collection(
        this.getCollectionRefWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter),
        (ref) =>
          ref
            //.where('start', '>=', fb.default.firestore.Timestamp.fromDate(new Date(Date.now())))
            .orderBy('start', 'asc')
            .startAt(start)
            .limit(limit)
      );
      ref
        .get()
        .toPromise()
        .then((data) => {
          const docs = data.docs;
          if (docs.length > 0) {
            resolve(
              docs.map((doc) => {
                let _ = doc.data() as Meet;
                console.log('fixing status for user with uid of:', userId);
                _.fixUserStatus(userId);
                return _;
              })
            );
          } else {
            console.warn('no meets found');
            resolve([]);
          }
        });
    });
  }

  /**
   * writes a join request to collection 'joinReq'
   * @param teamId
   * @param clubId
   * @param userId
   * @param actualUserId
   * @param userName
   * @returns void
   */
  async createJoinRequest(
    teamId: string,
    clubId: string,
    userId: string,
    actualUserId: string,
    userName: string,
    displayName: string
  ) {
    await this.afs.collection('joinReq').add({
      teamId: teamId,
      clubId: clubId,
      userId: userId,
      actualUserId: actualUserId,
      userName: userName,
      displayName: displayName,
    });
  }

  /** write meet to collection 'meets'
   * @param meet
   * @param teamId
   * @param clubId
   * @returns void
   * @throws error if team does not exist
   * @throws error if club does not exist
   * @throws error if meet is undefined
   */
  async writeMeet(meet: Meet, teamId: string, clubId: string) {
    if (!meet) {
      throw new Error('meet is undefined');
    }
    await this.afs
      .collection(
        this.getCollectionRefWithConverter(`clubs/${clubId}/teams/${teamId}/meets`, Meet.converter)
      )
      .doc(meet.uid)
      .set(meet);
  }
  /** writes a mutation request to collection mutateReq inf firestore
   * @param clubId
   * @param teamId
   * @param meetId
   * @param userId
   * @param status
   */
  async writeMutationRequest(
    clubId: string,
    teamId: string,
    meetId: string,
    userId: string,
    status: 'accepted' | 'declined' | 'pending',
    meet: Meet
  ) {
    await this.afs.collection('mutateReq').add({
      clubId: clubId,
      teamId: teamId,
      meetId: meetId,
      userId: userId,
      status: status,
    });
    if (status == 'accepted') {
      meet.acceptedUsers.push(userId);
      const i = meet.declinedUsers.indexOf(userId);
      if (i != -1) {
        meet.declinedUsers.splice(i, 1);
      }
    }
    if (status == 'declined') {
      meet.declinedUsers.push(userId);
      const i = meet.acceptedUsers.indexOf(userId);
      if (i != -1) {
        meet.acceptedUsers.splice(i, 1);
      }
    }
    if (status == 'pending') {
      const i = meet.acceptedUsers.indexOf(userId);
      const j = meet.declinedUsers.indexOf(userId);
      if (j != -1) {
        meet.declinedUsers.splice(j, 1);
      }
      if (i != -1) {
        meet.acceptedUsers.splice(i, 1);
      }
    }
    return meet;
  }

  /** get team name string from local syncedClubs
   * @param teamId
   * @param clubId
   * @returns team name string
   * @throws error if team does not exist
   * @throws error if club does not exist
   */
  getTeamName(teamId: string, clubId: string) {
    return this.syncedClubs.get(clubId).clubData.teams.get(teamId).name;
  }
  getDocumentRefWithConverterFromPath(path: string, converter: any) {
    return this.afs.firestore.doc(path).withConverter(converter);
  }
  getCollectionRefWithConverter(path: string, converter: any) {
    return this.afs.firestore.collection(path).withConverter(converter);
  }
}

// structure was drawn on paper :(
