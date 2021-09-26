import { DocumentReference } from '@angular/fire/firestore';
import { Meet } from './meet';

export class Team {
  uid: string;
  ref: DocumentReference;
  name: string;

  // non-constructor fields
  teamData: TeamData;

  constructor(uid: string, ref: DocumentReference, name: string) {
    this.uid = uid;
    this.ref = ref;
    this.name = name;
  }

  static converter = {
    fromFirestore: function (snapshot: any, options: any) {
      const data = snapshot.data(options);
      return new Team(snapshot.id, snapshot.ref, data.name);
    },
    toFirestore: function (team: Team) {
      return {
        name: team.name,
      };
    },
  };
}

export class TeamData {
  roles: Object;

  meets: Meet[];
  constructor(roles: Object) {
    this.roles = roles;
  }

  static converter = {
    fromFirestore: function (snapshot: any, options: any) {
      const data = snapshot.data(options);
      return new TeamData(data.roles);
    },
    toFirestore: function (team: TeamData) {
      return {
        roles: team.roles,
      };
    },
  };
}
