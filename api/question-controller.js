"use strict";
const ROUTE_PREFIX = '/v2/questions';
const authorizationHelper = require('../helpers/authorize-helper');
const dataService = require('../services/data-service');

module.exports = (app) => {
    app.post(`${ROUTE_PREFIX}/answer`,authorizationHelper.checkAdmin, submitAnswer );
    app.get(`${ROUTE_PREFIX}/one`,authorizationHelper.checkAdmin, getOneRandomQuestion );
    
    
};

function submitAnswer(req, res) {
    const data = req.body,
        userTelegramId = req.headers['telegram-id'],
        answer = data.answer;
    
    if (answer){
        dataService.incrementCorrectAnswers(userTelegramId)
    }else{
        dataService.incrementWrongAnswers(userTelegramId)
    }
    res.json({
        message : 'success'
    })
    
}

function getOneRandomQuestion(req, res) {
    const data = req.query,
        userTelegramId = req.headers['telegram-id'],
        category = data.category;
    
    dataService.getOneRandomQuestion(category)
        .then(result => {
            dataService.incrementQuestion(userTelegramId);
            res.json({
                message: 'success',
                data:result
            })
        })
        .catch(err => {
            console.log('get one random question error : ', err)
        });
}