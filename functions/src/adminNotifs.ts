import * as functions from 'firebase-functions';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';
const admin = require('firebase-admin');

const db = admin.firestore();
// const _p: 'headcoach' | 'coach' | 'member' = 'headcoach';

exports.newUserCreated = functions
  .region('europe-west6')
  .firestore.document('authUsers/{userId}')
  .onCreate(async (snap, context) => {
    return new Promise<void>((resolve, reject) => {
      db.collection('fbm_push_tokens')
        .doc('6UPSx6oMoAgPdnaqjcSsTzUgzx93')
        .get()
        .then(async (doc: DocumentSnapshot) => {
          const data = doc.data() || {};
          const tokens = data.tokens || [];

          var message = {
            notification: {
              title: 'Neuer Benutzer',
              body: `${snap.data().username} hat sich registriert.`,
            },
            tokens: tokens,
          };

          admin
            .messaging()
            .sendMulticast(message)
            .then((response: any) => {
              console.log(response.successCount + ' messages were sent successfully');
              resolve();
            })
            .catch((error: any) => {
              console.log(error);
              reject();
            });
        });
    });
  });
