import * as functions from 'firebase-functions';
const admin = require('firebase-admin');

const db = admin.firestore();

// const _p: 'headcoach' | 'coach' | 'member' = 'headcoach';

exports.createCodesForTeam = functions
  .region('europe-west6')
  .firestore.document('clubs/{clubId}/teams/{teamId}')
  .onCreate(async (snap, context) => {
    return Promise.all([
      new Promise((resolve) => {
        db.collection('joinCodes').add({
          clubId: context.params.clubId,
          teamId: context.params.teamId,
          role: 'member',
        });
      }),
      new Promise((resolve) => {
        db.collection('joinCodes').add({
          clubId: context.params.clubId,
          teamId: context.params.teamId,
          role: 'coach',
        });
      }),
      new Promise((resolve) => {
        db.collection('joinCodes').add({
          clubId: context.params.clubId,
          teamId: context.params.teamId,
          role: 'headcoach',
        });
      }),
    ]);
  });
