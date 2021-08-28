import { DocumentReference } from '@angular/fire/firestore';
import { Team } from './team';

export class Club {
  uid: string;
  ref: DocumentReference;
  // fields for name and logo both string
  name: string;
  logo: string;

  // non-constructor fields
  clubData: ClubData;
  // constructor for all fields
  constructor(uid: string, ref: DocumentReference, name: string, logo: string) {
    this.uid = uid;
    this.name = name;
    this.logo = logo;
  }

  // firestore data converter
  static converter = {
    toFirestore: function (club: Club) {
      return {
        name: club.name,
        logo: club.logo,
      };
    },
    fromFirestore: function (snapshot: any) {
      return new Club(snapshot.id, snapshot.ref, snapshot.data().name, snapshot.data().logo);
    },
  };
}

export class ClubData {
  uid: string;
  ref: DocumentReference;
  users: Object;
  license: number;
  teams: Map<string, Team> = new Map<string, Team>();

  constructor(uid: string, ref: DocumentReference, roles: any, license: number) {
    this.uid = uid;
    this.ref = ref;
    this.users = roles;
    this.license = license;
  }

  static converter = {
    toFirestore: function (clubData: ClubData) {
      return {
        roles: clubData.users,
        license: clubData.license,
      };
    },
    fromFirestore: function (snapshot: any, options: any) {
      const data = snapshot.data(options);
      return new ClubData(snapshot.id, snapshot.ref, data.roles, data.license);
    },
  };
}
