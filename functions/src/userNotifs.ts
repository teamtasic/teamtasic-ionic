import * as functions from 'firebase-functions';
import { Change, EventContext } from 'firebase-functions';
import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase-functions/v1/firestore';
const admin = require('firebase-admin');

const db = admin.firestore();

exports.newTrainingCreated = functions
  .region('europe-west6')
  .firestore.document('clubs/{clubId}/teams/{teamId}/meets/{meetId}')
  .onCreate(async (snapshot: DocumentSnapshot, context) => {
    var notifPromises: Promise<any>[] = [];

    const meet = snapshot.data();

    const clubId = context.params.clubId;
    const teamId = context.params.teamId;
    // const meetId = context.params.meetId;

    const teamRef = db.collection('clubs').doc(clubId).collection('teams').doc(teamId);
    teamRef.get().then(async (teamSnapshot: DocumentSnapshot) => {
      const team = teamSnapshot.data();
      const teamName = team?.name;
      var authUser: string;
      const users: string[] = team?.users;
      users.forEach(async (user: string) => {
        notifPromises.push(
          new Promise<void>((resolve_outers, reject) => {
            new Promise<void>((resolve, reject) => {
              db.collection('sessionUsers')
                .doc(user)
                .get()
                .then((userSnapshot: any) => {
                  const data = userSnapshot.data();
                  authUser = data.owner;
                  resolve();
                });
            }).then(() => {
              Promise.all([
                new Promise<string[]>((resolve, reject) => {
                  db.collection('fbm_push_tokens')
                    .doc(authUser)
                    .get()
                    .then((tokenSnapshot: DocumentSnapshot) => {
                      const data = tokenSnapshot.data();
                      const tokens: string[] = data ? data.tokens : [];
                      resolve(tokens);
                    });
                }),
                new Promise<Object>((resolve, reject) => {
                  db.collection('authUsers')
                    .doc(authUser)
                    .get()
                    .then((authUserSnapshot: DocumentSnapshot) => {
                      const data = authUserSnapshot.data();
                      const opts = data?.pushNotificationOptions || {
                        enabled: false,
                        newTrainingNotifications: false,
                        trainingChangedNotifications: false,
                        trainingReminderNotifications: false,
                      };
                      resolve(opts);
                    });
                }),
              ]).then((values: any[]) => {
                const tokens = values[0].filter(
                  (token: string) => token !== '' && token !== undefined
                );
                const userPushNotifOptions = values[1];

                if (
                  userPushNotifOptions.enabled &&
                  userPushNotifOptions.newTrainingNotifications &&
                  tokens.length > 0
                ) {
                  const payload = {
                    notification: {
                      title: `Neuer Termin - ${meet?.start.toDate().toLocaleDateString('de-CH')}`,
                      body: `[ ${teamName} ] Neuer Termin erstellt`,
                    },
                    apns: {
                      payload: {
                        aps: {
                          sound: 'default',
                        },
                      },
                    },
                    priority: 'high',
                    tokens: tokens,
                  };

                  admin
                    .messaging()
                    .sendMulticast(payload)
                    .then((response: any) => {
                      console.log(response.successCount + ' messages were sent successfully');
                      resolve_outers();
                    })
                    .catch((error: any) => {
                      console.log(error);
                      reject();
                    });
                }
              });
            });
          })
        );
      });
      return Promise.all(notifPromises);
    });
  });

exports.trainingChanged = functions
  .region('europe-west6')
  .firestore.document('clubs/{clubId}/teams/{teamId}/meets/{meetId}')
  .onUpdate((change: Change<QueryDocumentSnapshot>, context: EventContext) => {
    // check if the deadline or the comment has changed
    const before = change.before.data();
    const after = change.after.data();
    if (before.comment == after.comment) {
      return null;
    }

    var notifPromises: Promise<any>[] = [];

    const meet = after;

    const clubId = context.params.clubId;
    const teamId = context.params.teamId;

    const teamRef = db.collection('clubs').doc(clubId).collection('teams').doc(teamId);
    teamRef.get().then(async (teamSnapshot: DocumentSnapshot) => {
      const team = teamSnapshot.data();
      const teamName = team?.name;
      var authUser: string;
      const users: string[] = team?.users;
      users.forEach(async (user: string) => {
        notifPromises.push(
          new Promise<void>((resolve_outers, reject) => {
            new Promise<void>((resolve, reject) => {
              db.collection('sessionUsers')
                .doc(user)
                .get()
                .then((userSnapshot: any) => {
                  const data = userSnapshot.data();
                  authUser = data.owner;
                  resolve();
                });
            }).then(() => {
              Promise.all([
                new Promise<string[]>((resolve, reject) => {
                  db.collection('fbm_push_tokens')
                    .doc(authUser)
                    .get()
                    .then((tokenSnapshot: DocumentSnapshot) => {
                      const data = tokenSnapshot.data();
                      const tokens: string[] = data ? data.tokens : [];
                      resolve(tokens);
                    });
                }),
                new Promise<Object>((resolve, reject) => {
                  db.collection('authUsers')
                    .doc(authUser)
                    .get()
                    .then((authUserSnapshot: DocumentSnapshot) => {
                      const data = authUserSnapshot.data();
                      const opts = data?.pushNotificationOptions || {
                        enabled: false,
                        newTrainingNotifications: false,
                        trainingChangedNotifications: false,
                        trainingReminderNotifications: false,
                      };
                      resolve(opts);
                    });
                }),
              ]).then((values: any[]) => {
                const tokens = values[0].filter(
                  (token: string) => token !== '' && token !== undefined
                );
                const userPushNotifOptions = values[1];

                if (
                  userPushNotifOptions.enabled &&
                  userPushNotifOptions.trainingChangedNotifications &&
                  tokens.length > 0
                ) {
                  const payload = {
                    notification: {
                      title: `Termin bearbeitet `,
                      body: `[ ${teamName} ] Der Termin am ${meet?.start
                        .toDate()
                        .toLocaleDateString('de-CH')} wurde bearbeitet`,
                    },
                    apns: {
                      payload: {
                        aps: {
                          sound: 'default',
                        },
                      },
                    },
                    priority: 'high',
                    tokens: tokens,
                  };

                  admin
                    .messaging()
                    .sendMulticast(payload)
                    .then((response: any) => {
                      console.log(response.successCount + ' messages were sent successfully');
                      resolve_outers();
                    })
                    .catch((error: any) => {
                      console.log(error);
                      reject();
                    });
                }
              });
            });
          })
        );
      });
    });
    return Promise.all(notifPromises);
  });
