import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

export const joinUserToTeam = functions
  .region('europe-west6')
  .firestore.document('joinReq/{joinReqId}')
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const teamId = data.teamId;
    const userId = data.userId;
    const clubId = data.clubId;
    const userName = data.userName;
    const displayName = data.displayName;
    const actualUserId = data.actualUserId;

    // apend entry to user documents membership array
    return Promise.all([
      db
        .collection('users')
        .doc(`${actualUserId}`)
        .update({
          memberships: admin.firestore.FieldValue.arrayUnion({
            team: teamId,
            club: clubId,
            name: userName,
            displayName: displayName,
            userId: userId,
            role: 'athlete',
            type: 'team',
          }),
        }),
      //snapshot.ref.delete(),
    ]);
  });
