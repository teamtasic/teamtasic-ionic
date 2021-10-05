import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

const db = admin.firestore();

exports.joinUserToTeam = functions
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
      snapshot.ref.delete(),
    ]);
  });

// function for removing user from team
exports.leaveUserFromTeam = functions
  .region('europe-west6')
  .firestore.document('leaveReq/{leaveReqId}')
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const teamId = data.teamId;
    const userId = data.userId;
    const clubId = data.clubId;
    return new Promise<void>((resolve, reject) => {
      // apend entry to user documents membership array
      console.log('user:', `${userId.substring(0, userId.indexOf('-'))}`, 'team:', teamId);
      db.collection('users')
        .doc(`${userId.substring(0, userId.indexOf('-'))}`)
        .get()
        .then((doc: any) => {
          const userData = doc.data();
          const memberships = userData.memberships;
          // memberships.forEach((membership: any) => {
          //   if (
          //     membership['team'] == teamId &&
          //     membership['club'] == clubId &&
          //     membership['userId'] == userId
          //   ) {
          //     // remove the membership from the memberships array
          //     console.log('removing membership@', memberships.indexOf(membership));
          //     memberships.splice(memberships.indexOf(membership), 1);
          //   }
          // });
          const newMemberships = memberships.filter((membership: any) => {
            console.log(
              'comparing: ',
              membership['team'] == teamId,
              membership['club'] == clubId,
              membership['userId'] == userId
            );
            return !(
              membership['team'] == teamId &&
              membership['club'] == clubId &&
              membership['userId'] == userId
            );
          });
          return db
            .collection('users')
            .doc(`${userId.substring(0, userId.indexOf('-'))}`)
            .update({
              memberships: newMemberships,
            })
            .then(() => {
              console.log(newMemberships.toString());
              resolve();
            });
        });
    });
  });
