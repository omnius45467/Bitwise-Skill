var alexa = require('alexa-app'),
    app = new alexa.app(),
    mongoose = require('mongoose'),
    env = require('node-env-file'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Promise = require('bluebird');


env(__dirname + '/.env', {verbose: true, overwrite: true, raise: false, logger: console});

mongoose.connect(process.env.MLAB);
mongoose.Promise = Promise;


/**
 * LaunchRequest.
 */
app.launch(function (request, response) {
    var greetingArray = [
        "Hi there! Welcome to Bitwise! What can I do for you?",
        "Welcome to Bitwise, how can I help?",
        "Hi, welcome to Bitwise. Is there something I can help you find?"
    ];
    var repromptArray = [
        "Hello? Is this thing on?",
        "Can I help you with something?",
        "Is any one there?"
    ];
    var random = Math.floor(Math.random() * greetingArray.length);
    response.say(greetingArray[random]);
    response.reprompt(repromptArray[random]);
    response.shouldEndSession(false);
    // response.send();
});

var Company = new Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    suite: {
        type: Number,
        required: true
    },
    floor: {
        type: Number,
        required: true
    }
});

var CompanyModel = mongoose.model('companies', Company);

/**
 * IntentRequest.
 */
app.intent('CompanyIntent',
    {
        'slots': {'company': 'LIST_OF_COMPANIES'},
        'utterances': ['find the company {company}']
    },
    function (request, response) {
        CompanyModel.findOne({utteranceName: request.slot('company')})
            .then(function (company) {
                response.say('I found ' + company.name + ' which is located at suite number ' + company.suite + ' on floor ' + company.floor);
                response.shouldEndSession(true);
                response.send();
            })
            .catch(function (err) {
                response.say('something bad happened');
                response.shouldEndSession(true);
                response.send();
            });

        return false;
    }
);
app.intent('ContactIntent',
    {
        'slots': {'company': 'LIST_OF_COMPANIES'},
        'utterances': ['who can I talk to from {company}', 'is there someone I can talk to from {company}', 'who can I see from {company}']
    },
    function (request, response) {
        CompanyModel.findOne({utteranceName: request.slot('company')})
            .then(function (company) {
                response.say('Talk to '+company.contact+'. Should I contact them for you?');
                response.shouldEndSession(true);
                response.send();
            })
            .catch(function (err) {
                response.say('something bad happened');
                response.shouldEndSession(true);
                response.send();
            });

        return false;
    }
);
app.intent('EndIntent', {'utterances': ['thank you', 'stop']}, function (request, response) {
    response.say('by your command');
    response.shouldEndSession(true);
    response.send();
    mongoose.connection.close();

});


/**
 * Error handler for any thrown errors.
 */
app.error = function (exception, request, response) {
    response.say('Sorry, something bad happened');
};

// Connect to lambda
exports.handler = app.lambda();