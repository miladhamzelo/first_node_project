var express = require('express');
var bodyParser = require('body-parser');
var app = express();


var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function () {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/test');


var questionSchema = new mongoose.Schema({
    questionText: String,
    firstOption: String,
    secondOption: String,
    thirdOption: String,
    fourthOption: String,
    correctOption: String,
    category: String,
    status: String

});

var Question = mongoose.model('Question', questionSchema);
var question = new Question({
    question: 'testQuestion',
    firstOption: 'test',
    secondOption: 'test',
    thirdOption: 'test',
    fourthOption: 'test',
    correctOption: 'test4',
    correctOption: 'test4',
    category: "kosssher",
    status: 'pending'
});

// question.save(function(err, thor) {
//     if (err) return console.error(err);
// });



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.route('/question/:category?:status?')
    .get(function (req, res) {
        console.log(req.query.status);
        var category = req.query.category;
        Question.find({category: category, status: 'active'}, function (err, questions) {

            if (err) return console.error(err);
            console.log(questions);
            res.send(questions);
        });

    })
    .post(function (req, res) {
        var question = new Question(req.body);
        console.log(question);
        question.save(function (err, question) {
            if (err) return res.send(err);
            res.send(question);
        });

    });

app.listen(3000);
