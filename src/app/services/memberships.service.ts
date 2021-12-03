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
  createJoinLink(role: string, clubId: string, teamId?: string) {
    return new Promise<string>(async (resolve, reject) => {
      const ref = await this.afs.collection('joinLinks').add({
        role: role,
        clubId: clubId,
        teamId: teamId,
      });

      resolve(ref.id);
    });
  }
  invalidateJoinLink(linkId: string) {}
  joinUsingLink(linkId: string) {
    return new Promise<void>((resolve, reject) => {});
  }
  leaveFromTeam(userId: string, teamId: string, clubId: string) {}
}

/** Join link foramt
 * https://teamtasic.app/signup-and-join?j=<uid>
 *
 *
 *
 */
