import { DocumentReference } from '@angular/fire/firestore';

export class AuthUserData {
  uid: string;
  ref: DocumentReference;

  username: string;
  email: string;
  // memberships{
  /*  "teamUID": {
        "displayName": "teamLabel",
        "role": "owner",
        "name": "Username"
    }
  }*/
  memberships: Object;

  constructor(
    uid: string,
    ref: DocumentReference,
    username: string,
    email: string,
    memberships: Object | null
  ) {
    this.uid = uid;
    this.ref = ref;
    this.username = username;
    this.email = email;
    this.memberships = memberships;
  }

  static converter = {
    fromFirestore(snapshot: any, options: any): AuthUserData {
      const data = snapshot.data(options);
      return new AuthUserData(
        snapshot.id,
        snapshot.ref,
        data.username,
        data.email,
        data.memberships
      );
    },
    toFirestore(data: AuthUserData): any {
      return {
        username: data.username,
        email: data.email,
        memberships: data.memberships,
      };
    },
  };
}
