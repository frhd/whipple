var express = require('express');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
var OpenTok = require('opentok')


// set TokBox Api Key and secret
var apiKey = "45937382";
var apiSecret = "5f7cfb241d251ca855b256c2c4aba040d4d221b8";

// Initialize OpenTok
var opentok = new OpenTok(apiKey, apiSecret);
// needed for session geneeration to work directly after app restart
generateNewSessionID();


}

function generateNewSessionID() {
    opentok.createSession({
        mediaMode: "relayed"
    }, function(err, session) {
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
app.get('/', function(req, res) {
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
        client.query('SELECT * FROM public.meetings_v2', function(err, result) {
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
app.get('/addmeeting', function(req, res) {
    res.render('pages/addmeeting');
});

// Add new meeting to the database
app.post('/meetings', function(req, res) {
    // generate new Session Id
    generateNewSessionID();
    const sessionId = app.get('sessionId');
    const name = req.body.meetingName;
    const audioOnly = req.body.audioOnly;
    if (typeof sessionId != 'undefined') {

        console.log(audioOnly);

        // insert into database
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            client.query('INSERT into  public.meetings_v2 (session_id, session_name, audio_only) VALUES($1, $2, $3)', [sessionId, name, audioOnly], function(err, result) {
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

// Join a meeting
app.get('/meetings/:sessionId', function(req, res) {

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
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});