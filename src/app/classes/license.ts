import * as fb from 'firebase';

export default class license {
  uid: string;
  validUntil: Date;

  constructor(uid: string, validUntil: Date) {
    this.uid = uid;
    this.validUntil = validUntil;
  }

  get validUntilTimestamp(): fb.default.firestore.Timestamp {
    return fb.default.firestore.Timestamp.fromDate(this.validUntil as Date);
  }

  static converter = {
    fromFirestore: function (snapshot: any, options: any) {
      const data = snapshot.data(options);
      return new license(
        snapshot.ref.id,
        (data.validUntil as fb.default.firestore.Timestamp).toDate()
      );
    },
    toFirestore: function (license: license) {
      return {
        uid: license.uid,
        validUntil: license.validUntilTimestamp,
      };
    },
  };
}
