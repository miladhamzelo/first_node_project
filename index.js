var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var morgan = require('morgan');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./jwt/config'); // get our config file
var User = require('./models/user');
var UserManagement = require('./user_management/userManagement');



var mongoose = require('mongoose');
var Question = require('./models/question');
var db = mongoose.connection;


db.on('error', console.error);
db.once('open', function () {
    // Create your schemas and models here.
});

mongoose.connect('mongodb://localhost/brainduel');



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.route('/question/:category?:status?')
    .get(getQuestions)
    .post(createQuestions);


 function getQuestions (req, res) {
    console.log(req.query.category);
    var category = req.query.category;
    Question.find({category: category, status: 'active'}, function (err, questions) {

        if (err) return console.error(err);
        console.log(questions);
        res.send(questions);
    });

};

 function createQuestions (req, res) {
    var question = new Question(req.body);
    console.log(question);
    question.save(function (err, question) {
        if (err) return res.send(err);
        res.send(question);
    });
};

app.post('/signup',UserManagement.checkUserNameIsAvailable, UserManagement.signup);

app.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

// get an instance of the router for api routes

app.post('/login',UserManagement.signin);
app.get('/test_token', UserManagement.verfiyToken ,function (req , res) {
    res.send(req.user);
});


app.listen(3000);
