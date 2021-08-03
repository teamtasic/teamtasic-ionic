import { DocumentReference } from "@angular/fire/firestore";

export class AuthUserData {
  uid: string;
  ref: DocumentReference;

  username: string;
  email: string;
  memberships: string[];

  constructor(uid: string, ref: DocumentReference, username: string, email: string, memberships: string[]) {
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
        memberships: data.memberships
      };
    },
    fromFirestore(data: any): AuthUserData {
      return new AuthUserData(
        data.ref.uid,
        data.ref,
        data.username,
        data.email,
        data.memberships
      );
    }
  };
}

