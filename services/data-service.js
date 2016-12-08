const BotUser = require('../models/botUsers');
const Question = require('../models/question');

module.exports = {
    createBotUserIfNotExist,
    incrementCorrectAnswers,
    incrementWrongAnswers,
    incrementQuestion,
    updatebotUserCallers,
    updateBotBlockState,
    getUser,

    getOneRandomQuestion
};

function createBotUserIfNotExist(userData) {
    const caller = userData.caller ;
    return BotUser.find({telegramId: userData.telegramId}, function (err, botUsers) {
        if (err) return res.send(err);
        if (botUsers.length > 0) {
            if (caller && !botUsers[0].callers.includes(caller)){
                botUsers[0].callers.push(caller);
                botUsers[0].save();
            }
            return botUsers[0]
        } else {
            const botUser = new BotUser(userData);
            botUser.save(function (err, botUser) {
                if (err) return res.send(err);
                return botUser
            });
        }
    });
}

function incrementCorrectAnswers(userTelegramId) {
    return BotUser.findOne({telegramId: userTelegramId}, function (err, botUser) {
        botUser.correctAnswers += 1;
        botUser.save();
    })
}

function incrementWrongAnswers(userTelegramId) {
    return BotUser.findOne({telegramId: userTelegramId}, function (err, botUser) {
        botUser.wrongAnswers += 1;
        botUser.save();
    })
}

function incrementQuestion(userTelegramId) {
    return BotUser.findOne({telegramId: userTelegramId}, function (err, botUser) {
        botUser.questionCount += 1;
        botUser.save();
    })
}

function updatebotUserCallers(userTelegramId, caller) {
    return BotUser.findOne({telegramId: userTelegramId}, function (err, botUser) {
        if (!botUser.callers.includes(caller)) {
            botUser.callers.push(caller);
        }
        botUser.save();
    })
}

function updateBotBlockState(userTelegramId, block) {
    user.findOneAndUpdate({userTelegramId}, {blockedBot: block})
}

function getUser(userTelegramId) {
    return BotUser.findOne({telegramId: userTelegramId});
}


//////********** question functions ************
function getOneRandomQuestion(category) {
    return Question.count({category: category}, function (err, c) {
        if (c > 2) {
            categoryQuestionsCount = c - 2;
        }
        var randomNumberForCategoryQuestion = Math.floor(Math.random() * categoryQuestionsCount);
        return Question.findOne({category, status: 'active'}).skip(randomNumberForCategoryQuestion);
    });
}


