import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

export const deleteTeam = functions.firestore
  .document('clubs/{clubId}/teams/{teamId}')
  .onDelete((change, context) => {
    const teamId: string = context.params.teamId;
    const clubId: string = context.params.clubId;

    return Promise.all([
      new Promise<void>((resolve) => {
        // get team data
        var teamData: Object;

        const teamRef = db
          .collection('clubs')
          .doc(clubId)
          .collection('teams')
          .doc(teamId)
          .collection('teamData')
          .doc('teamData');
        teamRef.get().then((doc: any) => {
          teamData = doc.data();
          console.log('Team data: ', teamData);
        });

        // delete team from all users
        const usersRef = db.collection('users');
        usersRef.get().then((querySnapshot: any) => {
          querySnapshot.forEach((doc: any) => {
            const userData = doc.data();
            let memberships: Object = userData.memberships;

            delete (memberships as any)[teamId];

            usersRef
              .doc(doc.id)
              .set(
                {
                  memberships: memberships,
                },
                { merge: true }
              )
              .then(() => {
                console.log('Deleted team from user: ', doc.id);
                resolve();
              });

            // delete all subcollections teamData and meets
          });
        });
      }),
      db
        .collection('clubs')
        .doc(`${clubId}`)
        .collection('teams')
        .doc(`${teamId}`)
        .collection('teamData')
        .get()
        .then((snapshot: any) => {
          snapshot.forEach((doc: any) => {
            doc.ref.delete();
          });
        }),
      db
        .collection('clubs')
        .doc(`${clubId}`)
        .collection('teams')
        .doc(`${teamId}`)
        .collection('meets')
        .get()
        .then((snapshot: any) => {
          snapshot.forEach((doc: any) => {
            doc.ref.delete();
          });
        }),
    ]);
  });
