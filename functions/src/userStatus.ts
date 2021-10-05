import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

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
