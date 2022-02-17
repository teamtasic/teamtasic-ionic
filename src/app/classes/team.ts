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
  profilePictureUrls: any;
  roleNames: any;
  hiddenMembers: string[];

  constructor(
    uid: string,

    name: string,
    names: {
      [key: string]: string;
    },
    users: string[],
    trainers: string[],
    headTrainers: string[],
    admins: string[],
    owner: string,
    profilePictureUrls: {
      [key: string]: string;
    },
    roleNames: {
      athletes: string;
      athlete: string;
      trainers: string;
      trainer: string;
      headTrainers: string;
      headTrainer: string;
      teams: string;
      team: string;
    },
    hiddenMembers: string[]
  ) {
    this.uid = uid;

    this.name = name;
    this.names = names;
    this.users = users;
    this.trainers = trainers;
    this.headTrainers = headTrainers;
    this.admins = admins;
    this.owner = owner || '';
    this.profilePictureUrls = profilePictureUrls;
    this.roleNames = roleNames;
    this.hiddenMembers = hiddenMembers;
  }

  static converter = {
    fromFirestore: function (snapshot: DocumentSnapshot<Team>) {
      const data = snapshot.data();
      if (!data) {
        return null;
      }
      let t = new Team(
        snapshot.id,
        data.name || '',
        data.names || {},
        data.users || [],
        data.trainers || [],
        data.headTrainers || [],
        data.admins || [],
        // local querys are kinda important tho
        snapshot.ref.parent.parent?.id || '',
        data.profilePictureUrls || {},
        data.roleNames || Team.roleNamesDefault,
        data.hiddenMembers || []
      );
      for (const uid in t.names) {
        if (t.profilePictureUrls[uid]) {
          continue;
        }
        t.profilePictureUrls[uid] = `https://avatars.dicebear.com/api/initials/${t.names[uid]}.svg`;
      }
      return t;
    },
    toFirestore: function (team: Team) {
      return {
        name: team.name,

        names: team.names,
        users: team.users,
        trainers: team.trainers,
        headTrainers: team.headTrainers,
        admins: team.admins,
        owner: team.owner,
        profilePictureUrls: team.profilePictureUrls,
        roleNames: team.roleNames,
        hiddenMembers: team.hiddenMembers,
      };
    },
  };

  static roleNamesDefault = {
    athletes: 'Athleten',
    athlete: 'Athlet',
    trainers: 'Trainer',
    trainer: 'Trainer',
    headTrainers: 'Chefrainer',
    headTrainer: 'Cheftrainer',
    team: 'Team',
    teams: 'Teams',
  };
}
