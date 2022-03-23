import * as fb from 'firebase';

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

  tasks: meetTask[] = [];

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
    tasks: meetTask[]
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
      let x = new Meet(
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
      console.log(x.getDate, 'getDate');
      return x;
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
  static createMeet(
    meetName: string,
    startDate: Date,
    endDate: Date,
    location: string,
    clubId: string,
    teamId: string,
    comment: string,
    deadline: number,
    provisionally: boolean,
    limitedSlots: boolean,
    slots: number
  ): Meet {
    return new Meet(
      '',
      meetName,
      startDate,
      endDate,
      location,
      clubId,
      teamId,
      [],
      [],
      comment,
      deadline,
      {},
      provisionally,
      limitedSlots,
      slots,
      []
    );
  }

  static convertToFBTimestamp(date: Date) {
    return fb.default.firestore.Timestamp.fromDate(date);
  }

  static null: Meet = new Meet(
    '',
    '',
    new Date(Date.now()),
    new Date(Date.now()),
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
    8,
    []
  );

  /**
   * Gets the start and end date of the meet in readable format
   *
   *
   * @type {string}
   * @memberof Meet
   */
  get getDate(): string {
    return (
      this.start.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',

        hour: 'numeric',
        minute: 'numeric',
      }) +
      ' - ' +
      this.end.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
      })
    );
  }
}

export interface meetTask {
  title: string;
  description: string;
  slots: number;
  isTrainerOnly: boolean;

  /**
   * under the hood values
   */
  users: string[];
  comments: { [key: string]: string | undefined };
}
