import { DocumentReference } from "@angular/fire/firestore";

export class Meet {
  uid: string;
  ref: DocumentReference;

  name: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
  userStates: Map<string, boolean>;

  constructor(uid: string, ref: DocumentReference, name: string, description: string, start: Date, end: Date, location: string, userStates: Map<string, boolean>) {
    this.uid = uid;
    this.ref = ref;
    this.name = name;
    this.description = description;
    this.start = start;
    this.end = end;
    this.location = location;
    this.userStates = userStates;
  }

  static converter = {
    fromFirestore: function (snapshot: any) {
      return new Meet(
        snapshot.id,
        snapshot.ref,
        snapshot.data().name,
        snapshot.data().description,
        new Date(snapshot.data().start),
        new Date(snapshot.data().end),
        snapshot.data().location,
        snapshot.data().userStates
      );
    },
    toFirestore: function (meet: Meet) {
      return {
        name: meet.name,
        description: meet.description,
        start: meet.start,
        end: meet.end,
        location: meet.location,
        userStates: meet.userStates
      }
    }
  }
}
