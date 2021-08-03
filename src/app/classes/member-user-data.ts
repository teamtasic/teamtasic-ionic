import { DocumentReference } from "@angular/fire/firestore";

export class MemberUserData {
  uid: string;
  ref: DocumentReference;

  displayTitle: string;
  name: string;
  teamID: string;
  role: number;

  constructor(uid: string, ref: DocumentReference, displayTitle: string, name: string, teamID: string, role: number) {
    this.uid = uid;
    this.ref = ref;
    this.displayTitle = displayTitle;
    this.name = name;
    this.teamID = teamID;
    this.role = role;
  }
}
