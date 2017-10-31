var express = require('express');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
var OpenTok = require('opentok')
var socket = require('socket.io')

//twilio
/**
 * Load Twilio configuration from .env config file - the following environment
 * variables should be set:
 * process.env.TWILIO_ACCOUNT_SID
 * process.env.TWILIO_API_KEY
 * process.env.TWILIO_API_SECRET
 */
require('dotenv').load();
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var apiKeySid = process.env.TWILIO_API_KEY;
var apiKeySecret = process.env.TWILIO_API_SECRET;
//var Twilio = require('twilio');
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

//var client = new Twilio(apiKeySid, apiKeySecret, {accountSid: accountSid});
//console.log("created twilio client on server " + client);

//create a test video room via twilio
/*
client.video.rooms
    .create({
        uniqueName: 'TestRoom',
    })
    .then(room => {
    console.log(room.sid);
});

client.video.rooms('TestRoom').fetch()
    .then((room) => {
        console.log(room.sid);
    });

*/

/**
 * Generate an Access Token for a video chat application user
 * username consists of the given name plus current server-timestamp
 * parameter.
 */
app.get('/twilio-token/:username', function(req, res) {
    var identity = req.params.username + "#" + Date.now();
    console.log("Identity created: " + identity);

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created.
    var token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET
    );

    // Assign the generated identity to the token.
    token.identity = identity;

    // Grant the access token Twilio Video capabilities.
    var grant = new VideoGrant();
    token.addGrant(grant);

    // Serialize the token to a JWT string and include it in a JSON response.
    res.send({
        identity: identity,
        token: token.toJwt()
    });
});


// set TokBox Api Key and secret
var apiKey = process.env.TOKBOX_API;
var apiSecret = process.env.TOKBOX_SECRET;



// Initialize OpenTok
var opentok = new OpenTok(apiKey, apiSecret);
// needed for session geneeration to work directly after app restart
generateNewSessionID();


function generateNewSessionID() {
    opentok.createSession({
        mediaMode: "routed"
    }, function (err, session) {
        if (err) throw err;
        app.set('sessionId', session.sessionId);
    });
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Routes
// ############################################################################

// Landing Page: Overview of currently active meetings

app.get('/', function (req, res) {
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function (err, client, done) {
        client.query('SELECT * FROM public.meetings_v2', function (err, result) {
            done();
            if (err) {
                console.error(err);
                res.send("Error " + err);
            } else {
                res.render('pages/overview', {
                    meetings: result.rows
                });
            }
        });
    });
});

// Create new meeting Page
app.get('/addmeeting', function (req, res) {
    res.render('pages/addmeeting');
});

// Twilio Test
// Create new meeting Page
app.get('/twilio', function (req, res) {
    res.render('pages/twilio-test');
});

app.get('/twilio2', function (req, res) {
    res.render('pages/twilio-test2');
});


// Add new meeting to the database
app.post('/meetings', function (req, res) {
    // generate new Session Id
    generateNewSessionID();
    const sessionId = app.get('sessionId');
    const name = req.body.meetingName;
    const audioOnly = req.body.audioOnly;
    if (typeof sessionId != 'undefined') {

        console.log(audioOnly);

        // insert into database
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            client.query('INSERT into  public.meetings_v2 (session_id, session_name, audio_only) VALUES($1, $2, $3)', [sessionId, name, audioOnly], function (err, result) {
                done();
                if (err) {
                    res.end('Error inserting meeting to database');
                } else {
                    //
                }
            });
        });

        res.redirect('/');
    }

    if (typeof sessionId == 'undefined') {
        res.end('Could not generate a new session ID');
    }
});

// A simpler way to create and join a meeting
// just a roomname is is needed (via url). The session is than created if it not already existed
// The user name is asked when the user enters the meeting
app.get('/room/:roomName', function (req, res) {
    // filter special characters
    const roomName = req.params.roomName.replace(/[^\w\s]/gi, '');
    var sessionId;

    // check, if room with that name already exists, otherwise create it in database
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function (err, client, done) {
        client.query('SELECT * FROM public.meetings_v2 where session_name = $1', [roomName], function (err, result) {
            done();
            if (err) {
                console.error(err);
                res.send("Error " + err);
            } else {
                // if room does not exits, create it now
                if (result.rows.length == 0) {

                    // create room
                    createRoom(roomName);

                }
                // join the room
                joinRoomByName(roomName, res);
            }
        });
    });
});

// creates a room with a given name
function createRoom(roomName){
    generateNewSessionID();
    sessionId = app.get('sessionId');
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function (err, client, done) {
        client.query('INSERT into  public.meetings_v2 (session_id, session_name, audio_only) VALUES($1, $2, $3)', [sessionId, roomName, false], function (err, result) {
            done();
            if (err) {
                res.end('Error inserting meeting to database');
            } else {
                console.log("Room " +  roomName + " created in database");
            }
        });
    });
}

// Join room by a given name
function joinRoomByName(roomName, res){
    pg.connect(process.env.DATABASE_URL + "?ssl=true", function (err, client, done) {
        // get session id for room
        client.query('SELECT * FROM public.meetings_v2 where session_name = $1', [roomName], function (err, result) {
            done();
            if (err) {
                console.error(err);
                res.send("Error " + err);
            } else {
                const sessionId = result.rows[0].session_id;
                const userName = 'no name';
                const audioOnly = false;

                // generate a fresh token for this client
                // console.log("Session ID " + sessionId);
                // wait for
                const token = opentok.generateToken(sessionId);

                // join the meeting
                res.render('pages/meeting', {
                    sessionName: roomName,
                    sessionId: sessionId,
                    userName: userName,
                    audioOnly: audioOnly,
                    token: token,
                    apiKey: apiKey
                });
            }
        });
    });
}


// Join a meeting
app.get('/meetings/:sessionId', function (req, res) {

    const sessionId = req.params.sessionId;
    const sessionName = req.query.meetingName;
    const userName = req.query.userName;
    const audioOnly = req.query.audioOnly;
    // generate a fresh token for this client
    const token = opentok.generateToken(sessionId);

    // return the meeting page
    res.render('pages/meeting', {
        sessionName: sessionName,
        sessionId: sessionId,
        userName: userName,
        audioOnly: audioOnly,
        token: token,
        apiKey: apiKey
    });

});


// Actually start app
// ############################################################################
var server = app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});



// Socket IO Code for handling meeting signals
var io = socket(server);
io.sockets.on('connection', function(socket) {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('sessionId', function(sessionId) {
        console.log("a client joined session " + sessionId);
        socket.join(sessionId);
        //emit all signal to the corresponding room
        socket.on('signal', function(data) {
            console.log("Got signal: " +data)
            io.sockets.in(sessionId).emit('signal', data);
        });
    });
});
