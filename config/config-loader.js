'use strict';
const nconf = require('nconf');
nconf.argv()
    .env()
    .file({file: './server-config.json'});

module.exports = nconf;
