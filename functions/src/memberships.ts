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
    const role = data.role;

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
            role: role,
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
    return Promise.all([
      new Promise<void>((resolve, reject) => {
        // apend entry to user documents membership array
        // console.log('user:', `${userId.substring(0, userId.indexOf('-'))}`, 'team:', teamId);
        db.collection('users')
          .doc(`${userId.substring(0, userId.indexOf('-'))}`)
          .get()
          .then((doc: any) => {
            const userData = doc.data();
            const memberships = userData.memberships;

            const newMemberships = memberships.filter((membership: any) => {
              // console.log(
              //   'comparing: ',
              //   membership['team'] == teamId,
              //   membership['club'] == clubId,
              //   membership['userId'] == userId
              // );
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
                // console.log(newMemberships.toString());
                resolve();
              });
          });
      }),
      snapshot.ref.delete(),
    ]);
  });
exports.addAdminToClub = functions
  .region('europe-west6')
  .firestore.document('addAdminReq/{addAdminReqId}')
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const clubId = data.clubId;
    const userId = data.userId;
    const displayName = data.displayName;

    // apend entry to user documents membership array
    return Promise.all([
      db
        .collection('users')
        .doc(`${userId}`)
        .update({
          memberships: admin.firestore.FieldValue.arrayUnion({
            club: clubId,
            displayName: displayName,
            userId: userId,
            role: 'admin',
            type: 'club',
          }),
        }),
      snapshot.ref.delete(),
    ]);
  });
/**
 * @since 2.0.0
 *
 * @param {string} userId
 * @param {string} clubId
 * @param {string} role
 * @param {string} displayName
 * @returns {Promise<void>}
 *
 * @memberof Functions
 * CF to update the status of a auth/session user in a team and corresp. Club
 */
exports.memberOperation = functions.https.onRequest(async (req, res) => {
  const body = req.body;

  // Data about the user getting added
  const userId = body.userId;
  const role = body.role;
  const clubId = body.clubId;
  const teamId = body.teamId;
  const remove = body.remove == 1 ? true : false;

  // get user name form firestore (collection: 'sessionUsers')
  const user = await db.collection('sessionUsers').doc(userId).get();

  // if any of the fields are empty, return error
  if (userId == '' || role == '' || clubId == '' || teamId == '') {
    res.status(510).send('Missing fields');
    return;
  }

  // update club document
  await db
    .collection('clubs')
    .doc(clubId)
    .update({
      members: !remove
        ? admin.firestore.FieldValue.arrayUnion(userId)
        : admin.firestore.FieldValue.arrayRemove(userId),
      admins:
        role != 'admin' && !remove
          ? admin.firestore.FieldValue.arrayRemove(userId)
          : admin.firestore.FieldValue.arrayUnion(userId),
      names: {
        [userId]: user.data().displayName,
      },
    });

  // update team document
  await db.doc(`clubs/${clubId}/teams/${teamId}`).update({
    users: !remove
      ? admin.firestore.FieldValue.arrayUnion(userId)
      : admin.firestore.FieldValue.arrayRemove(userId),
    trainers:
      role != 'trainer' && !remove
        ? admin.firestore.FieldValue.arrayRemove(userId)
        : admin.firestore.FieldValue.arrayUnion(userId),
    headTrainers:
      role != 'headTrainer' && !remove
        ? admin.firestore.FieldValue.arrayRemove(userId)
        : admin.firestore.FieldValue.arrayUnion(userId),
    admins:
      role != 'admin' && !remove
        ? admin.firestore.FieldValue.arrayRemove(userId)
        : admin.firestore.FieldValue.arrayUnion(userId),
    names: {
      [userId]: user.data().displayName,
    },
  });
  res.status(200).send('ok');
});
