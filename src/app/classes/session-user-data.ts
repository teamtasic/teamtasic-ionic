import { DocumentReference } from '@angular/fire/firestore';

export class SessionUserData {
  uid: string;
  owner: string;
  name: string;
  email: string;
  birthdate: string;
  phoneNumber: string;
  emergencyContact: string;
  otherData: {
    jsId: string;
    ahvNumber: string;
    ownsGA: boolean;
  };
  profilePictureUrl: string = '';

  constructor(
    uid: string,
    owner: string,
    name: string,
    email: string,
    birthdate: string,
    phoneNumber: string,
    emergencyContact: string,
    otherData: {
      jsId: string;
      ahvNumber: string;
      ownsGA: boolean;
    },
    profilePictureUrl: string = ''
  ) {
    this.uid = uid;
    this.owner = owner;
    this.name = name;
    this.email = email;
    this.birthdate = birthdate;
    this.phoneNumber = phoneNumber;
    this.emergencyContact = emergencyContact;
    this.otherData = otherData;
    this.profilePictureUrl = profilePictureUrl;
  }

  static converter = {
    fromFirestore(snapshot: any, options: any): SessionUserData {
      const data = snapshot.data(options);
      return new SessionUserData(
        snapshot.id,
        data.owner,
        data.name,
        data.email,
        data.birthdate,
        data.phoneNumber,
        data.emergencyContact,
        data.otherData || { jsId: '', ahvNumber: '', ownsGA: false },
        data.profilePictureUrl || `https://avatars.dicebear.com/api/initials/${data.name}.svg`
      );
    },
    toFirestore(data: SessionUserData): any {
      return {
        owner: data.owner,
        name: data.name,
        email: data.email,
        birthdate: data.birthdate,
        phoneNumber: data.phoneNumber,
        emergencyContact: data.emergencyContact,
        otherData: data.otherData,
        profilePictureUrl: data.profilePictureUrl,
      };
    },
  };
}

export interface sessionMembership {
  teamId: string;
  clubId: string;
  userId: string;
  displayName: string;
  role: 'admin' | 'headcoach' | 'coach' | 'member';
}
