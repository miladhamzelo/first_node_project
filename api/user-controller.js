"use strict";
const ROUTE_PREFIX = '/v2/users';
const authorizationHelper = require('../helpers/authorize-helper');
const dataService = require('../services/data-service');

module.exports = (app) => {
    app.post(`${ROUTE_PREFIX}/register`,authorizationHelper.checkAdmin, register );
    app.put(`${ROUTE_PREFIX}/block-state`,authorizationHelper.checkAdmin, blockedBot );
    app.get(`${ROUTE_PREFIX}/:id`,authorizationHelper.checkAdmin, getUser );

};

function register(req, res) {
    const data = req.body;
    dataService.createBotUserIfNotExist(data)
        .then(result => {
            res.json({
                message : 'success',
                data: result
            })
        })
        .catch(err => {
            res.status(406).json({
                message :'failure'
            });
            console.log('register user error : ' , err)
        })
}

function getUser(req, res) {
    const  userTelegramId = req.params.id;

    dataService.getUser(userTelegramId)
        .then(result => {
            res.json({
                message : 'success',
                data: result
            })
        })
        .catch(err => {
            console.log('register user error : ' , err)
        })
}



function blockedBot(req, res) {
    const data = req.body,
        userTelegramId = req.headers['telegram-id'],
        block = data.blocked;

    dataService.updateBotBlockState(userTelegramId, block)
        .then(result => {
            res.json({
                message : 'success',
                data: result
            })
        })
        .catch(err => {
            console.log('register user error : ' , err)
        })
}




