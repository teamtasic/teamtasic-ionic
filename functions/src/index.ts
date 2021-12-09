const admin = require('firebase-admin');
admin.initializeApp();

import * as joinCodes from './joinCodes';
import * as adminNotifs from './adminNotifs';

exports.joinCodes = joinCodes;
exports.adminNotifs = adminNotifs;
