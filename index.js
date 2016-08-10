var alexa = require('alexa-app'),
    app = new alexa.app(),
    mongoose = require('mongoose'),
    env = require('node-env-file');
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Promise = require('bluebird');

env('./.env',{verbose: true, overwrite: true, raise: false, logger: console});

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

        function getCompany(c){
            CompanyModel.findOne({ utteranceName: c}, function (err, doc){
                console.log(doc);
                if(!err && doc != null){
                    response.say('I found '+doc.name + ' which is located at suite number ' + doc.suite+' on floor '+doc.floor);
                    response.shouldEndSession(true);
                    response.send();
                    mongoose.connection.close();
                }else{
                    response.say('something bad happened');
                    response.shouldEndSession(true);
                    response.send();
                    mongoose.connection.close();
                }
            });
        }
        setTimeout(function() {
            var company = request.slot('company');
            console.log(company);
            getCompany(company);

        }, 100);

        return false;
    }
);
app.intent('ContactIntent',
    {
        'slots': {'company': 'LIST_OF_COMPANIES'},
        'utterances': ['who can I talk to from {company}', 'is there someone I can talk to from {company}', 'who can I see from {company}']
    },
    function (request, response) {

        function getCompany(c){
            CompanyModel.findOne({ utteranceName: c}, function (err, doc){
                console.log(doc);
                if(!err && doc != null){
                    response.say('Talk to '+doc.contact+" should I contact them for you?");
                    response.shouldEndSession(true);
                    response.send();
                    mongoose.connection.close();
                }else{
                    response.say('something bad happened');
                    response.shouldEndSession(true);
                    response.send();
                    mongoose.connection.close();
                }
            });
        }
        setTimeout(function() {
            var company = request.slot('company');
            console.log(company);
            getCompany(company);

        }, 100);

        return false;
    }
);
app.intent('EndIntent',{'utterances': ['thank you', 'stop']}, function (request, response) {
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