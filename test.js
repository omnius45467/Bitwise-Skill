/**
 * Created by jeremyrobles on 8/9/16.
 */
var mongoose = require('mongoose'),
    env = require('node-env-file'),
    Promise = require('bluebird');
Schema = mongoose.Schema;

env('./.env', {verbose: true, overwrite: true, raise: false, logger: console});
mongoose.Promise = Promise;
mongoose.connect(process.env.MLAB);

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

function getCompany(company) {
    // CompanyModel.findOne().select('name').exec( function (err, comp) {
    //     comp.isSelected('name');
    // });
    CompanyModel.findOne({ name: company}, function (err, doc){
        // doc is a Document
        // console.log(err);
        console.log(doc);
    });
}

var c = 'Bitwise';
var data = getCompany(c);
console.log(data);
// mongoose.connection.close();