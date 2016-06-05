// var express = require('express');
// var bodyParser = require('body-parser');
// var app = express();
//
// var morgan = require('morgan');
// var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var config = require('./jwt/config'); // get our config file
// var User = require('./models/user');
// var UserManagement = require('./user_management/userManagement');
//
//
//
// var mongoose = require('mongoose');
// var Question = require('./models/question');
// var db = mongoose.connection;
//
//
// db.on('error', console.error);
// db.once('open', function () {
//     // Create your schemas and models here.
// });
//
// mongoose.connect('mongodb://localhost/brainduel');
//
//
//
// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
// app.route('/question/:category?:status?')
//     .get(getQuestions)
//     .post(createQuestions);
//
//
//  function getQuestions (req, res) {
//     console.log(req.query.category);
//     var category = req.query.category;
//     Question.find({category: category, status: 'active'}, function (err, questions) {
//
//         if (err) return console.error(err);
//         console.log(questions);
//         res.send(questions);
//     });
//
// };
//
//  function createQuestions (req, res) {
//     var question = new Question(req.body);
//     console.log(question);
//     question.save(function (err, question) {
//         if (err) return res.send(err);
//         res.send(question);
//     });
// };
//
// app.post('/signup',UserManagement.checkUserNameIsAvailable, UserManagement.signup);
//
// app.get('/users', function (req, res) {
//     User.find({}, function (err, users) {
//         res.json(users);
//     });
// });
//
// // get an instance of the router for api routes
//
// app.post('/login',UserManagement.signin);
// app.get('/test_token', UserManagement.verfiyToken ,function (req , res) {
//     res.send(req.user);
// });
//
//
// app.listen(3000);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();


var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function () {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/brainduel');


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

var request = require('request');

var options = {
    url: ' https://api.parse.com/1/classes/Question/?limit=1000',
    headers: {
        'X-Parse-Application-Id': '3FRHqnsaulIUYl9zXTk4XHgkJRFx7zkTNf4HzMeu',
        'X-Parse-REST-API-Key': 'PUkXPafTXMJSz9VQmroxnpsw1HWuCptrr0td66fg'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        Question.find({ status: 'active'}, function (err, questions) {


        }).remove().exec();


        var result = JSON.parse(body);
        var questionArray = result.results;
        questionArray.forEach(function (item) {
            var question = new Question(item);
            question.status = "active";
            question.save(function (err, question) {
                if (err) return console.log(err);
            });
            

        });
        console.log("end of saving objects");
        // questionArray.forEach  (var item in questionArray){
        //     var question = new Question(item);
        //     question.status = "active";
        //     question.save(function (err, question) {
        //         if (err) return console.log(err);
        //     });
        //     console.log("end of saving objects");
        // };
        // console.log("fuck you");
    }
    else {
        console.log(error);
    }

}

request(options, callback);
