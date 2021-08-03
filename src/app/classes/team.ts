import { DocumentReference } from "@angular/fire/firestore";

export class Team {
  uid: string;
  ref: DocumentReference;
  name: string;

  members: string[];

  // non-constructor fields
  teamData: TeamData;

  constructor(uid: string, ref: DocumentReference,name: string, members: string[]) {
    this.uid = uid;
    this.name = name;
    this.members = members;
  }

  static converter = {
    fromFirestore: function (snapshot: any) {
      return new Team(
        snapshot.id,
        snapshot.ref,
        snapshot.data().name,
        snapshot.data().members
      );
    },
    toFirestore: function (team: Team) {
      return {
        name: team.name,
        members: team.members
      };
    }
  }
}


export class TeamData {
  uid: string;
  ref: DocumentReference;

  roles: Map<string, number>;
  names: string[];

  constructor(uid: string, ref: DocumentReference, roles: Map<string, number>, names: string[]) {
    this.uid = uid;
    this.ref = ref;
    this.roles = roles;
    this.names = names;
  }

  static converter = {
    fromFirestore: function (snapshot: any) {
      return new TeamData(
        snapshot.id,
        snapshot.ref,
        snapshot.data().roles,
        snapshot.data().names
      );
    },
    toFirestore: function (team: TeamData) {
      return {
        roles: team.roles,
        names: team.names
      };
    }
  }
}
