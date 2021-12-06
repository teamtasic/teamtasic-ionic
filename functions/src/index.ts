const admin = require('firebase-admin');
admin.initializeApp();

import * as joinCodes from './joinCodes';

exports.joinCodes = joinCodes;
