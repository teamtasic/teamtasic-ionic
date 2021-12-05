const admin = require('firebase-admin');
admin.initializeApp();

import * as membership from './memberships';
import * as deletion from './delete';
import * as userStatus from './userStatus';
import * as joinCodes from './joinCodes';

exports.memberships = membership;
exports.delete = deletion;
exports.userStatus = userStatus;

exports.joinCodes = joinCodes;
