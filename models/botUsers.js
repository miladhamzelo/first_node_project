/**
 * Created by Renjer on 5/5/16.
 */
// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('BotUser', new Schema({
    firstName: String,
    lastName: String,
    telegramUserName: String,
    telegramId: {type:String , unique : true},
    questionCount : {type:Number, default :0},
    correctAnswers :{type:Number, default :0},
    wrongAnswers :{type:Number, default :0},
    callers :{type: [String], default :[]},
    blockedBot :{type :Boolean, default :false}
    
}));