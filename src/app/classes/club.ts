import { DocumentReference } from '@angular/fire/firestore';
import { Team } from './team';

export class Club {
  uid: string;

  name: string;
  names: Object;
  admins: string[];
  members: string[];

  /**
   * Object representing a club. This also holds the membership data of the teams corresponding to the club.
   * @since 1.0.0
   * @param uid - the uid of the club
   * @param name - the name of the club
   * @param users - the users of the club
   */
  constructor(uid: string, name: string, names: Object, admins: string[], members: string[]) {
    this.uid = uid;
    this.name = name;
    this.names = names;
    this.admins = admins;
    this.members = members;
  }

  // firestore data converter
  static converter = {
    toFirestore: function (club: Club) {
      return {
        name: club.name,
        names: club.names,
        admins: club.admins,
        members: club.members,
      };
    },
    fromFirestore: function (snapshot: any) {
      let data = snapshot.data();
      return new Club(snapshot.id, data.name, data.names, data.admins, data.members);
    },
  };
}

/**
 * @deprecated in 2.0.0
 */
export class ClubData {
  constructor() {
    throw new Error('This class is deprecated.');
  }
}
