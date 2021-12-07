export class AuthUserData {
  uid: string;

  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  zipcode: string;

  constructor(
    uid: string,
    username: string,
    email: string,
    phoneNumber: string = '',
    address: string = '',
    zipcode: string = ''
  ) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.zipcode = zipcode;
  }

  static converter = {
    fromFirestore(snapshot: any, options: any): AuthUserData {
      const data = snapshot.data(options);
      return new AuthUserData(
        snapshot.id,
        data.username,
        data.email,
        data.phoneNumber,
        data.address,
        data.zipcode
      );
    },
    toFirestore(data: AuthUserData): any {
      return {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        zipcode: data.zipcode,
      };
    },
  };
}

export class AdminData {
  clubs: string[];
  teamsByClub: Map<string, string[]>;

  constructor(clubs: string[], teamsByClub: Map<string, string[]> = new Map()) {
    this.clubs = clubs;
    this.teamsByClub = teamsByClub;
  }
}
