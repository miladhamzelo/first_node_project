"use strict";
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const  client = redis.createClient();

const ROUTE_PREFIX = '/v2/config';
const authorizationHelper = require('../helpers/authorize-helper');
const dataService = require('../services/data-service');

module.exports = (app) => {
    app.post(`${ROUTE_PREFIX}/player`, setConfig );
    app.get(`${ROUTE_PREFIX}/player`, getConfig );


};

function setConfig(req, res) {
    const data = req.body;

    client.setAsync('player-config',JSON.stringify(data))
    .then(result => {
      res.json({
      message:'success'
      });
    })
    .catch(err => {
      res.status(406).json({message:err.message})
    })

}

function getConfig(req, res){
client.getAsync('player-config')
.then(result => {
  const data = JSON.parse(result);
  res.json({
  message:'success',
  data
  });
})
.catch(err => {
  res.status(406).json({message:err.message})
})
}
