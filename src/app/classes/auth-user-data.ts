import { DocumentReference } from '@angular/fire/firestore';

export class AuthUserData {
  uid: string;
  ref: DocumentReference;

  username: string;
  email: string;
  memberships: string[];

  constructor(
    uid: string,
    ref: DocumentReference,
    username: string,
    email: string,
    memberships: string[] | null
  ) {
    this.uid = uid;
    this.ref = ref;
    this.username = username;
    this.email = email;
    this.memberships = memberships;
  }

  static converter = {
    toFirestore(data: AuthUserData): any {
      return {
        username: data.username,
        email: data.email,
        memberships: data.memberships,
      };
    },
    fromFirestore(data: any): AuthUserData {
      let _memberships = data.memberships;
      if (!_memberships) {
        _memberships = [];
      }
      return new AuthUserData(data.ref.uid, data.ref, data.username, data.email, _memberships);
    },
  };
}
