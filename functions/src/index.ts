import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

export const deleteTeam = functions
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

export const setUserstatus = functions
  .region('europe-west6')
  .firestore.document('mutateReq/{reqId}')
  .onCreate((snapshot, context) => {
    const data = snapshot.data();
    const clubId = data.clubId;
    const teamId = data.teamId;
    const meetId = data.meetId;
    const userId = data.userId;
    const status = data.status;

    switch (status) {
      case 'accepted':
        return new Promise<void>((resolve, reject) => {
          db
            .collection('clubs')
            .doc(`${clubId}`)
            .collection('teams')
            .doc(`${teamId}`)
            .collection('meets')
            .doc(`${meetId}`)
            .update({
              acceptedUsers: admin.firestore.FieldValue.arrayUnion(userId),
              declinedUsers: admin.firestore.FieldValue.arrayRemove(userId),
            }),
            resolve();
        });
      case 'declined':
        return new Promise<void>((resolve, reject) => {
          db
            .collection('clubs')
            .doc(`${clubId}`)
            .collection('teams')
            .doc(`${teamId}`)
            .collection('meets')
            .doc(`${meetId}`)
            .update({
              acceptedUsers: admin.firestore.FieldValue.arrayRemove(userId),
              declinedUsers: admin.firestore.FieldValue.arrayUnion(userId),
            }),
            resolve();
        });
      case 'pending':
        return new Promise<void>((resolve, reject) => {
          db
            .collection('clubs')
            .doc(`${clubId}`)
            .collection('teams')
            .doc(`${teamId}`)
            .collection('meets')
            .doc(`${meetId}`)
            .update({
              acceptedUsers: admin.firestore.FieldValue.arrayRemove(userId),
              declinedUsers: admin.firestore.FieldValue.arrayRemove(userId),
            }),
            resolve();
        });
    }
    return Promise.reject(new Error('Invalid status'));
  });
