/**
 * Created by ananyagoel on 07/12/16.
 */


var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' }
    // user: 'sachin',
    // pass: 'god'
}

var url = "mongodb://localhost/production_db";

module.exports = options


