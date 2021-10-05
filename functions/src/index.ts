const admin = require('firebase-admin');
admin.initializeApp();

exports.memberships = require('./memebrships');
exports.delete = require('./delete');
exports.userStatus = require('./userStatus');
