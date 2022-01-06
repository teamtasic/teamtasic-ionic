import { DocumentSnapshot } from '@angular/fire/firestore';

export class Team {
  uid: string;

  name: string;

  names: any;
  users: string[];
  trainers: string[];
  headTrainers: string[];
  admins: string[];
  owner: string;

  constructor(
    uid: string,

    name: string,
    names: Object,
    users: string[],
    trainers: string[],
    headTrainers: string[],
    admins: string[],
    owner?: string
  ) {
    this.uid = uid;

    this.name = name;
    this.names = names;
    this.users = users;
    this.trainers = trainers;
    this.headTrainers = headTrainers;
    this.admins = admins;
    this.owner = owner || '';
  }

  static converter = {
    fromFirestore: function (snapshot: DocumentSnapshot<Team>) {
      const data = snapshot.data();
      if (!data) {
        return null;
      }
      return new Team(
        snapshot.id,
        data.name || '',
        data.names || {},
        data.users || [],
        data.trainers || [],
        data.headTrainers || [],
        data.admins || [],
        // local querys are kinda important tho
        snapshot.ref.parent.parent?.id
      );
    },
    toFirestore: function (team: Team) {
      return {
        name: team.name,

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
