var alexa = require('alexa-app'),
    app = new alexa.app(),
    mongoose = require('mongoose'),
    env = require('node-env-file');
    Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;

    Promise = require('bluebird');

env('./.env');

mongoose.connect(process.env.MLAB);


mongoose.Promise = Promise;

/**
 * LaunchRequest.
 */
app.launch(function (request, response) {
    var greetingArray = [
        "Hi there! Welcome to Bitwise!",
        "Welcome to Bitwise",
        "Hi, welcome to Bitwise. Is there something I can help you find?"
    ];
    var random = Math.floor(Math.random()*greetingArray.length);
    response.say(greetingArray[random]);
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
        setTimeout(function() {
            function getCompany(c){
                CompanyModel.findOne({ name: c}, function (err, doc){
                    console.log(doc);
                    if(!err){
                        response.say(doc.name + ' is on floor number ' + doc.floor + ", suite number "+ doc.suite);
                        response.reprompt('Can I help you with something?');
                        response.shouldEndSession(true);
                        response.send();
                        mongoose.connection.close();
                    }else{
                        response.say('I cant seem to find the company your looking for');
                        response.reprompt('Can I help you with something?');
                        response.shouldEndSession(true);
                        response.send();
                        mongoose.connection.close();
                    }
                });
            }
            var company = request.slot('company');
            getCompany(company);

        }, 250);
        
        return false;
    }
);
app.intent('EndIntent', {
    'utterances': ['stop','thank you' ]
}, function(request, response){
    response.say('by your command');
    response.shouldEndSession(true);
    response.send();
});

/**
 * Error handler for any thrown errors.
 */
app.error = function (exception, request, response) {
    response.say('Sorry, something bad happened');
};

// Connect to lambda
exports.handler = app.lambda();
