const admin = require('firebase-admin');
admin.initializeApp();

import * as joinCodes from './joinCodes';
import * as adminNotifs from './adminNotifs';
import * as userNotifs from './userNotifs';

exports.joinCodes = joinCodes;
exports.adminNotifs = adminNotifs;
exports.userNotifs = userNotifs;
