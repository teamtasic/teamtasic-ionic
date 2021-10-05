const admin = require('firebase-admin');
admin.initializeApp();

import * as membership from './memberships';
import * as deletion from './delete';
import * as userStatus from './userStatus';

exports.memberships = membership;
exports.delete = deletion;
exports.userStatus = userStatus;
