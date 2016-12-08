'use strict';

const config = require('../config/config-loader');

module.exports = {
    checkAdmin
};


function checkAdmin(req, res, next) {
    if (req.get('X-Renjer-Token') === config.get('AUTHORIZE_TOKEN')) {
        next();
    } else {
        res.json({message: "unAuthorize"})
    }
}