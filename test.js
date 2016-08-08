var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    env = require('node-env-file'),
    Promise = require('bluebird');

env('./.env',{verbose: true, overwrite: true, raise: false, logger: console});
mongoose.connect(process.env.MLAB);

var CompanySchema = new Schema({
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
        required:true
    },
    suite: {
        type:Number,
        required:true
    },
    floor: {
        type:Number,
        required:true
    }
});

mongoose.Promise = Promise;


var CompanyModel = mongoose.model('companies', CompanySchema);
var company = 'Bitwise';

var test = CompanyModel.findOne({name: company})
    .then(function(comp) {
        return comp.name;
    })
    .catch(function (err) {
        console.log(err);

    });
console.log(test);