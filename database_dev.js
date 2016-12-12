/**
 * Created by ananyagoel on 27/11/16.
 */

var mongoose= require('mongoose');

mongoose.Promise = global.Promise;

var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' }
    // user: 'sachin',
    // pass: 'god'
}

var url = "mongodb://localhost/dev_db";

mongoose.connect(url, options)
    .then(function () {
        console.log("connection successful")
    }).catch(function (err) {
    console.log(err)
})
module.exports = mongoose


