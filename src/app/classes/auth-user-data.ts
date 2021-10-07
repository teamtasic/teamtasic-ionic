import { DocumentReference } from '@angular/fire/firestore';

export class AuthUserData {
  uid: string;
  ref: DocumentReference;

  username: string;
  email: string;
  // fields added 2021-10-06
  phoneNumber: string;
  birthDate: string;
  address: string;
  zipcode: string;

  memberships: Object[];

  constructor(
    uid: string,
    ref: DocumentReference,
    username: string,
    email: string,
    memberships: Object[],
    phoneNumber: string = '',
    birthDate: string = '',
    address: string = '',
    zipcode: string = ''
  ) {
    this.uid = uid;
    this.ref = ref;
    this.username = username;
    this.email = email;
    this.memberships = memberships;
    this.phoneNumber = phoneNumber;
    this.birthDate = birthDate;
    this.address = address;
    this.zipcode = zipcode;
  }

  static converter = {
    fromFirestore(snapshot: any, options: any): AuthUserData {
      const data = snapshot.data(options);
      return new AuthUserData(
        snapshot.id,
        snapshot.ref,
        data.username,
        data.email,
        data.memberships,
        data.phoneNumber,
        data.birthDate,
        data.address,
        data.zipcode
      );
    },
    toFirestore(data: AuthUserData): any {
      return {
        username: data.username,
        email: data.email,
        memberships: data.memberships,
        phoneNumber: data.phoneNumber,
        birthDate: data.birthDate,
        address: data.address,
        zipcode: data.zipcode,
      };
    },
  };
}
