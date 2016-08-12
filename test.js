/**
 * Created by jeremyrobles on 8/9/16.
 */
var mongoose = require('mongoose'),
    env = require('node-env-file'),
    Promise = require('bluebird');
Schema = mongoose.Schema;

env('./.env');
mongoose.Promise = Promise;
mongoose.connect(process.env.MLAB);

var Company = new Schema({
    utteranceName:{
        type: String,
        required:true
    },
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

function getCompany(company) {
    CompanyModel.findOne({ utteranceName: company}, function (err, doc){
        console.log(doc);
        mongoose.connection.close();
    });
}

var c = 'bit wise';
getCompany(c);