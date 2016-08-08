var alexa = require('alexa-app'),
    app = new alexa.app(),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    env = require('node-env-file'),
    Promise = require('bluebird');

env('./.env',{verbose: true, overwrite: true, raise: false, logger: console});

mongoose.connect(process.env.MLAB);

console.log(process.env.MLAB);

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

mongoose.Promise = Promise;

var CompanyModel = mongoose.model('companies', Company);


/**
 * LaunchRequest.
 */
app.launch(function (request, response) {

    var greetingArray = [
        "Hi there!",
        "Welcome to Bitwise",
        "Is there something I can help you find?"
    ];
    
    response.say(greetingArray[Math.floor(Math.random() * greetingArray.length - 1)]);
    response.card("Welcome to Bitwise Industries!");
    response.shouldEndSession(false);
});


/**
 * IntentRequest.
 */
app.intent('CompanyIntent',
    {
        'slots': {'company': 'LIST_OF_COMPANIES'},
        'utterances': ['find the company {company}']
    },
    function (request, response) {
        var company = request.slot('company');
        var dialogArray = [
            'you asked for the company ',
            'here is what I found for the company ',
            'is this what you are looking for '
        ];
        CompanyModel.findOne({name: company}, function (err, comp) {
            if(!err){
                response.say(comp.name);
                response.shouldEndSession(true);
                response.send();
            }
        });
    }
);

/**
 * Error handler for any thrown errors.
 */
app.error = function (exception, request, response) {
    response.say('Sorry, something bad happened');
};

// Connect to lambda
exports.handler = app.lambda();
