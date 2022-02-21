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
  /**
   * Comments by Trainers on this meet
   *
   * @type {string}
   * @memberof Meet
   * @since 2.1.0
   */
  comment: string;
  /**
   * Deadline in days
   *
   * @type {number}
   * @memberof Meet
   * @since 2.1.0
   */
  deadline: number;

  acceptedUsers: string[] = [];
  declinedUsers: string[] = [];

  comments: { [key: string]: string };

  provisionally: boolean;

  /**
   * Max number of accepted users for this meet
   * -1 means no limit
   * @type {number}
   */
  limitedSlots: boolean;
  slots: number;

  tasks: {
    title: string;
    description: string;
    users: string[];
    comments: { [key: string]: string | undefined };
  }[] = [];

  constructor(
    uid: string,
    title: string,
    start: Date,
    end: Date,
    meetpoint: string,
    clubId: string,
    teamId: string,
    acceptedUsers: string[] = [],
    declinedUsers: string[] = [],
    comment: string,
    deadline: number,
    comments: {
      [key: string]: string;
    },
    provisionally: boolean,
    limitedSlots: boolean,
    slots: number,
    tasks: {
      title: string;
      description: string;
      users: string[];
      comments: { [key: string]: string | undefined };
    }[]
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
    this.comment = comment;
    this.deadline = deadline;
    this.comments = comments;
    this.provisionally = provisionally;
    this.limitedSlots = limitedSlots;
    this.slots = slots;
    this.tasks = tasks;
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
        snapshot.ref.id,
        data.title,
        (data.start as fb.default.firestore.Timestamp).toDate(),
        (data.end as fb.default.firestore.Timestamp).toDate(),
        data.meetpoint,
        data.clubId,
        data.teamId,
        data.acceptedUsers || [],
        data.declinedUsers || [],
        data.comment || '',
        data.deadline || 0,
        data.comments || {},
        data.provisionally || false,
        data.limitedSlots || false,
        data.slots || data.acceptedUsers?.length || 0,
        data.tasks || []
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
        comment: meet.comment,
        deadline: meet.deadline,
        comments: meet.comments,
        provisionally: meet.provisionally,
        limitedSlots: meet.limitedSlots,
        slots: meet.slots,
        tasks: meet.tasks,
      };
    },
  };

  static convertToFBTimestamp(date: Date) {
    return fb.default.firestore.Timestamp.fromDate(date);
  }

  static getSTDTimezoneOffset() {
    const jan = new Date(new Date(Date.now()).getFullYear(), 0, 1);
    const jul = new Date(new Date(Date.now()).getFullYear(), 6, 1);
    const stdAdj = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

    if (new Date(Date.now()).getTimezoneOffset() < stdAdj) {
      return stdAdj;
    } else {
      return stdAdj - 60;
    }
  }
  static null: Meet = new Meet(
    '',
    '',
    new Date(),
    new Date(),
    '',
    '',
    '',
    [],
    [],
    '',
    0,
    {},
    false,
    false,
    0,
    []
  );
}
