import { DocumentReference } from '@angular/fire/firestore';
export class Team {
  uid: string;
  owner: string;
  name: string;

  names: Object;
  users: string[];
  trainers: string[];
  headTrainers: string[];
  admins: string[];

  constructor(
    uid: string,
    owner: string,
    name: string,
    names: Object,
    users: string[],
    trainers: string[],
    headTrainers: string[],
    admins: string[]
  ) {
    this.uid = uid;
    this.owner = owner;
    this.name = name;
    this.names = names;
    this.users = users;
    this.trainers = trainers;
    this.headTrainers = headTrainers;
    this.admins = admins;
  }

  static converter = {
    fromFirestore: function (snapshot: any, options: any) {
      const data = snapshot.data(options);
      return new Team(
        snapshot.id,
        data.owner,
        data.name,
        data.names,
        data.users,
        data.trainers,
        data.headTrainers,
        data.admins
      );
    },
    toFirestore: function (team: Team) {
      return {
        name: team.name,
        owner: team.owner,
        names: team.names,
        users: team.users,
        trainers: team.trainers,
        headTrainers: team.headTrainers,
        admins: team.admins,
      };
    },
  };
}

export class TeamData {
  constructor() {
    throw new Error('TeamData is depreceated');
  }
}
