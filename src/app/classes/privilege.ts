export class Privilege {
  intValue: number;

  constructor(intValue: number) {
    this.intValue = intValue;
  }

  setValue(intValue) {
    console.log('[ 🔏 ROLES ]', 'attemting role change to value: ', intValue);
    this.intValue = intValue;
  }

  isAdmin() {
    return this.intValue > 5;
  }
  isHeadCoach() {
    return this.intValue > 4;
  }
  isCoach() {
    return this.intValue > 3;
  }
  isMember() {
    return this.intValue > 2;
  }

  isMaintainer() {
    return false;
  }
}
