import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { DataRepositoryService } from './data-repository.service';

@Injectable({
  providedIn: 'root',
})

/**
 * @brief Service to manage memberships - CRUD operations
 * @author @JesseB0rn
 * @since 2.0.0
 */
export class MembershipsService {
  constructor(private afs: AngularFirestore, private drs: DataRepositoryService) {}
  /**
   *  Creates a link to join a team specified by the teamId.
   * @param {string} role - The role of the user joining the team.
   * @param {string} clubId
   * @param {string} [teamId]
   * @memberof MembershipsService
   * @returns {Promise<string>} The link uid
   */
  createJoinCode(
    role: 'admin' | 'headcoach' | 'coach' | 'member',
    clubId: string,
    teamId?: string
  ) {
    return new Promise<string>(async (resolve, reject) => {
      const ref = await this.afs.collection('joinCodes').add({
        role: role,
        clubId: clubId,
        teamId: teamId || '',
      });

      resolve(ref.id);
    });
  }
  joinUsingCode(code: string, userId: string, name: string) {
    return new Promise<void>(async (resolve, reject) => {
      this.afs
        .collection('joinCodes')
        .doc(code)
        .get()
        .toPromise()
        .then(async (doc) => {
          if (doc.exists) {
            const data = doc.data() as {
              role: 'admin' | 'headcoach' | 'coach' | 'member';
              clubId: string;
              teamId: string;
            };
            const role: 'admin' | 'headcoach' | 'coach' | 'member' = data['role'];
            const clubId = data['clubId'];
            const teamId = data['teamId'];
            console.log('Code resolved to: ', role, clubId, teamId);
            this.drs
              .getClub(clubId)
              .toPromise()
              .then((club: any) => {
                if (role === 'admin') {
                  club?.admins.push(userId);
                }
                club.names[userId] = name;
                this.drs.updateClub(club, clubId);
              });
            if (role != 'admin') {
              this.drs.getTeam(teamId, clubId).then((team) => {
                console.log(team);
                if (role == 'headcoach' && team.headTrainers.indexOf(userId) == -1) {
                  team.headTrainers.push(userId);
                }
                if (
                  (role == 'coach' || role == 'headcoach') &&
                  team.trainers.indexOf(userId) == -1
                ) {
                  team.trainers.push(userId);
                }
                if (
                  (role == 'member' || role == 'coach' || role == 'headcoach') &&
                  team.users.indexOf(userId) == -1
                ) {
                  team.users.push(userId);
                }
                team.names[userId] = name;
                // console.log('Team with new user: ', team);
                this.drs.updateTeam(team, clubId, teamId);
                resolve(undefined);
              });
            }
          } else {
            reject('Invalid code');
          }
        });
    });
  }
  leaveFromTeam(userId: string, teamId: string, clubId: string) {
    return new Promise<void>((resolve, reject) => {
      this.drs.getTeam(teamId, clubId).then((team) => {
        console.log(team);

        const i_head = team.headTrainers.indexOf(userId);
        const i_trainer = team.trainers.indexOf(userId);
        const i_user = team.users.indexOf(userId);
        if (i_head != -1) {
          team.headTrainers.splice(i_head, 1);
        }
        if (i_trainer != -1) {
          team.trainers.splice(i_trainer, 1);
        }
        if (i_user != -1) {
          team.users.splice(i_user, 1);
        }

        delete team.names[userId];
        console.log('Team with new user: ', team);
        this.drs.updateTeam(team, clubId, teamId);
        resolve(undefined);
      });
    });
  }
}

/** Join link foramt
 * https://teamtasic.app/signup-and-join?j=<uid>
 *
 *
 *
 */
