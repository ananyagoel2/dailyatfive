/**
 * Created by ananyagoel on 13/12/16.
 */

module.exports = {

    'facebook_auth' : {
        'client_ID'      : '1344797682211590', // your App ID
        'client_secret'  : '1e1bb925b862b13183d67bb2de00e091', // your App Secret
        'callback_URL'   : 'http://localhost:3000/register/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'name', 'gender','email', 'photos','birthday','friends']

    }
    //
    // 'twitterAuth' : {
    //     'consumerKey'       : 'your-consumer-key-here',
    //     'consumerSecret'    : 'your-client-secret-here',
    //     'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    // },
    //
    // 'googleAuth' : {
    //     'clientID'      : 'your-secret-clientID-here',
    //     'clientSecret'  : 'your-client-secret-here',
    //     'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    // }

};