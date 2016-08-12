var alexa = require('alexa-app'),
    app = new alexa.app(),
    mongoose = require('mongoose'),
    env = require('node-env-file'),
    startrek = require('startrek'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    Promise = require('bluebird');


env(__dirname + '/.env', {verbose: true, overwrite: true, raise: false, logger: console});

mongoose.connect(process.env.MLAB);
mongoose.Promise = Promise;

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

var repromptArray = [
    "Hello? Is this thing on?",
    "Can I help you with something?",
    "Is any one there?"
];

var CompanyModel = mongoose.model('companies', Company);

// LaunchRequest
app.launch(function (request, response) {
    var greetingArray = [
        "Hi there! Welcome to Bitwise! What can I do for you?",
        "Welcome to Bitwise, how can I help?",
        "Hi, welcome to Bitwise. Is there something I can help you find?"
    ];
    response.say(greetingArray[Math.floor(Math.random() * greetingArray.length)]);
    response.reprompt(repromptArray[Math.floor(Math.random() * repromptArray.length)]);
    response.shouldEndSession(false);
});

// Retrieve Company Information
app.intent('CompanyIntent',
    {
        'slots': {'company': 'LIST_OF_COMPANIES'},
        'utterances': ['find the company {company}']
    },
    function (request, response) {
        CompanyModel.findOne({utteranceName: request.slot('company')})
            .then(function (company) {
                var companyResponseArray = [
                    'I found ' + company.name + ' which is located at suite number ' + company.suite + ' on floor ' + company.floor,
                    'It looks like '+company.name+' is located on floor '+company.floor+' suite number '+company.suite

                ];
                var random = Math.floor(Math.random() * companyResponseArray.length);
                response.say(companyResponseArray[random]);
                response.reprompt(repromptArray[Math.floor(Math.random() * repromptArray.length)]);
                response.shouldEndSession(false);
                response.send();
            })
            .catch(function (err) {
                var errorArray = [
                    'hmmm, for some reason I can not locate any companies in the database',
                    'there might be an issue with the database, please try again in a bit when I have the  error rectified',
                    'I have encountered a problem accessing the database'
                ];
                response.say(errorArray[Math.floor(Math.random() * errorArray.length)]);
                response.reprompt(repromptArray[Math.floor(Math.random() * repromptArray.length)]);
                response.shouldEndSession(false);
                response.send();
            });

        return false;
    }
);
// Company Count
app.intent('CompanyCountIntent',
    {
        'utterances': ['how many companies are there in the building?', 'how many company are there', 'count the number of companies']
    },
    function (request, response) {
        CompanyModel.count({})
            .then(function (count) {
                var companyCountArray = [
                    'I found '+count+' companies in the building',
                    'there are '+count+' companies in the building',
                    'there are '+count+' companies',
                    count+' companies total',
                    count+' companies'
                ];
                // var random = Math.floor(Math.random() * companyCountArray.length);
                response.say(companyCountArray[Math.floor(Math.random() * companyCountArray.length)]);
                response.reprompt(repromptArray[Math.floor(Math.random() * repromptArray.length)]);
                response.shouldEndSession(false);
                response.send();
            })
            .catch(function (err) {
                var errorArray = [
                    'hmmm, for some reason I can not locate any companies in the database',
                    'there might be an issue with the database, please try again in a bit when I have the  error rectified',
                    'I have encountered a problem accessing the database'
                ];
                response.say(errorArray[Math.floor(Math.random() * errorArray.length)]);
                response.reprompt(repromptArray[Math.floor(Math.random() * repromptArray.length)]);
                response.shouldEndSession(false);
                response.send();
            });

        return false;
    }
);

// Retrieve Contact Information
app.intent('ContactIntent',
    {
        'slots': {'company': 'LIST_OF_COMPANIES'},
        'utterances': ['who can I talk to from {company}', 'is there someone I can talk to from {company}', 'who can I see from {company}']
    },
    function (request, response) {
        CompanyModel.findOne({utteranceName: request.slot('company')})
            .then(function (company) {
                var contactResponseArray = [
                    'Talk to '+company.contact+'. Should I contact them for you?',
                    'You can talk to '+company.contact+' from '+company.name+'. Their number is '+company.phone+' do you want me to get in contact for you?',
                    company.contact+' is the person you want to talk to, their number is '+company.phone
                ];
                var random = Math.floor(Math.random() * contactResponseArray.length);
                response.say(contactResponseArray[random]);
                response.reprompt(repromptArray[Math.floor(Math.random() * repromptArray.length)]);
                response.shouldEndSession(false);
                response.send();
            })
            .catch(function (err) {
                var errorArray = [
                    'hmmm, for some reason I can not locate any companies in the database',
                    'there might be an issue with the database, please try again in a bit when I have the  error rectified',
                    'I have encountered a problem accessing the database'
                ];
                response.say(errorArray[Math.floor(Math.random() * errorArray.length)]);
                response.reprompt(repromptArray[Math.floor(Math.random() * repromptArray.length)]);
                response.shouldEndSession(false);
                response.send();
            });

        return false;
    }
);
app.intent('EndIntent', {'utterances': ['thank you', 'stop']}, function (request, response) {
    response.say(startrek());
    response.shouldEndSession(true);
    response.send();
    mongoose.connection.close();

});

// Error handler for any thrown errors.

app.error = function (exception, request, response) {
    response.say('Sorry, something bad happened');
};

// Connect to lambda
exports.handler = app.lambda();