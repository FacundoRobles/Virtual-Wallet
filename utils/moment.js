const moment = require('moment');

module.exports.momentFunc= (timestamp) => moment(timestamp).format('"MMM Do YY"');
