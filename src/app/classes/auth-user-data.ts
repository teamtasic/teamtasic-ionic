export class AuthUserData {
  uid: string;

  username: string;
  email: string;
  phoneNumber: string;
  address: string;
  zipcode: string;
  pushNotificationOptions: {
    enabled: boolean;
    newTrainingNotifications: boolean;
    trainingChangedNotifications: boolean;
    trainingReminderNotifications: boolean;
  };

  constructor(
    uid: string,
    username: string,
    email: string,
    phoneNumber: string = '',
    address: string = '',
    zipcode: string = '',
    pushNotificationOptions: {
      enabled: boolean;
      newTrainingNotifications: boolean;
      trainingChangedNotifications: boolean;
      trainingReminderNotifications: boolean;
    }
  ) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.zipcode = zipcode;
    this.pushNotificationOptions = pushNotificationOptions;
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
        data.zipcode,
        data.pushNotificationOptions || {
          enabled: false,
          newTrainingNotifications: true,
          trainingChangedNotifications: true,
          trainingReminderNotifications: true,
        }
      );
    },
    toFirestore(data: AuthUserData): any {
      return {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        zipcode: data.zipcode,
        pushNotificationOptions: data.pushNotificationOptions,
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
