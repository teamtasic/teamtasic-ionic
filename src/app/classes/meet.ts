import * as fb from 'firebase';
import { BehaviorSubject } from 'rxjs';

export class Meet {
  uid: string;
  title: string;
  start: Date;
  end: Date;
  meetpoint: string;
  clubId: string;
  teamId: string;

  acceptedUsers: string[] = [];
  declinedUsers: string[] = [];

  constructor(
    uid: string,
    title: string,
    start: Date,
    end: Date,
    meetpoint: string,
    clubId: string,
    teamId: string,
    acceptedUsers: string[] = [],
    declinedUsers: string[] = []
  ) {
    this.uid = uid;
    this.title = title;
    this.start = start;
    this.end = end;
    this.meetpoint = meetpoint;
    this.clubId = clubId;
    this.teamId = teamId;
    this.acceptedUsers = acceptedUsers;
    this.declinedUsers = declinedUsers;
  }

  get startTimestamp(): fb.default.firestore.Timestamp {
    return fb.default.firestore.Timestamp.fromDate(this.start as Date);
  }

  get endTimestamp(): fb.default.firestore.Timestamp {
    return fb.default.firestore.Timestamp.fromDate(this.end as Date);
  }

  static converter = {
    fromFirestore: function (snapshot: any, options: any) {
      const data = snapshot.data(options);
      return new Meet(
        data.uid,
        data.title,
        (data.start as fb.default.firestore.Timestamp).toDate(),
        (data.end as fb.default.firestore.Timestamp).toDate(),
        data.meetpoint,
        data.clubId,
        data.teamId,
        data.acceptedUsers,
        data.declinedUsers
      );
    },
    toFirestore: function (meet: Meet) {
      return {
        uid: meet.uid,
        title: meet.title,
        start: meet.startTimestamp,
        end: meet.endTimestamp,
        meetpoint: meet.meetpoint,
        clubId: meet.clubId,
        teamId: meet.teamId,
        acceptedUsers: meet.acceptedUsers,
        declinedUsers: meet.declinedUsers,
      };
    },
  };
}
