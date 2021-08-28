// import { DocumentReference } from '@angular/fire/firestore';

// export class MemberUserData {
//   uid: string;
//   ref: DocumentReference;

//   displayTitle: string;
//   //owner: string;
//   name: string;
//   teamID: string;
//   role: number;

//   constructor(
//     uid: string,
//     ref: DocumentReference,
//     displayTitle: string,
//     owner: string,
//     name: string,
//     teamID: string,
//     role: number
//   ) {
//     this.uid = uid;
//     this.ref = ref;
//     this.displayTitle = displayTitle;
//     this.owner = owner;
//     this.name = name;
//     this.teamID = teamID;
//     this.role = role;
//   }

//   static converter = {
//     fromFirestore: (data: any) => {
//       return new MemberUserData(
//         data.ref.uid,
//         data.ref,
//         data.displayTitle,
//         data.name,
//         data.owner,
//         data.teamID,
//         data.role
//       );
//     },
//     toFirestore: (data: MemberUserData) => {
//       return {
//         displayTitle: data.displayTitle,
//         name: data.name,
//         owner: data.owner,
//         teamID: data.teamID,
//         role: data.role,
//       };
//     },
//   };
// }
