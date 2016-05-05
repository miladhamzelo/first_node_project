var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports =mongoose.model('Question',new Schema({
    questionText: String,
    firstOption: String,
    secondOption: String,
    thirdOption: String,
    fourthOption: String,
    correctOption: String,
    category: String,
    status: String

}));