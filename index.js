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
app.route('/question/:category?:status?:_id?')
    .get(getQuestions)
    .post(createQuestions)
    .put( UserManagement.verfiyToken,UserManagement.isAdmin,updateQuestion);
    // .put(updateQuestion);


 function getQuestions (req, res) {
     if (req.query._id) {
         Question.find({_id:req.query._id}, function (err, question) {

             if (err) return console.error(err);
             res.send(question);
         });
     } else {
     var category = req.query.category;
     Question.find({category: category, status: 'active'}, function (err, questions) {

         if (err) return console.error(err);
         res.send(questions);
     });
 }
};

 function createQuestions (req, res) {
    var question = new Question(req.body);
     question.status = "pending";
    question.save(function (err, question) {
        if (err) return res.send(err);
        res.send(question);
    });
};

function updateQuestion(req, res) {
        var _id = req.query._id;
        var status = req.query.status;
        Question.findOneAndUpdate({_id : _id},{$set:{status :status}}, function (err) {
            
            if (err) return res.send(err);
            res.json({message:"success"});
        });
        
}

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

app.get('/admin/questions:begin?:total?',UserManagement.verfiyToken,UserManagement.isAdmin,getPendingQuestions);
function getPendingQuestions(req , res) {
    var begin = req.query.begin;
    var total = req.query.total;
    Question.find({ status: 'pending'}, function (err, questions) {

        if (err) return console.error(err);
        res.send(questions);
    }).limit(parseInt(total)).skip(parseInt(begin));
}


app.listen(3000);
