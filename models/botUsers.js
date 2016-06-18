/**
 * Created by Renjer on 5/5/16.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('BotUser', new Schema({
    name: String,
    lastName: String,
    telegramUserName: String,
    telegramId: String,
    questionCount : Number
}));