import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

const db = admin.firestore();

exports.deleteTeam = functions
  .region('europe-west6')
  .firestore.document('clubs/{clubId}/teams/{teamId}')
  .onDelete((change, context) => {
    const teamId: string = context.params.teamId;
    const clubId: string = context.params.clubId;

    return Promise.all([
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
