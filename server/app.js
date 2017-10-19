const express = require("express");
const path = require("path");
const OpenTok = require("opentok");
const pg = require("pg");
const API = require("../src/shared/constants");

const app = express();

const API_KEY = process.env.REACT_APP_TOKBOX_API;
const SECRET = process.env.REACT_APP_TOKBOX_SECRET;
const DB = process.env.REACT_APP_DATABASE_URL;
const opentok = new OpenTok(API_KEY, SECRET);

function generateNewSessionID() {
  //console.log("generating new session");
  opentok.createSession({
    mediaMode: "routed",
  }, (err, session) => {
    if (err) throw err;
    app.set("sessionId", session.sessionId);
  });
}

// creates a session with a given name
function createSession(sessionName) {
  generateNewSessionID();
  const sessionId = app.get("sessionId");
  if (sessionId !== undefined) {
    //console.log("Session ID " , sessionId);
    pg.connect(`${DB}?ssl=true`, (err, client, done) => {
      const queryString = "INSERT into public.meetings_v2 (session_id, session_name, audio_only) VALUES($1, $2, $3)";
      client.query(queryString,
        [sessionId, sessionName, false],
        (error, result) => {
          done();
          if (error) {
            throw err;
          } else {
            console.log(`Room ${sessionName} created in database`);
          }
        });
    });
  }
}

/*
app.get("/session/create/", (req, res) => {
  const API_KEY = process.env.REACT_APP_TOKBOX_API;
  const SECRET = process.env.REACT_APP_TOKBOX_SECRET;
  const opentok = new OpenTok(API_KEY, SECRET);


  opentok.createSession({
    mediaMode: "routed",
  }, (err, session) => {
    if (err) throw err;
    const result = { sessionId: session.sessionId };
    console.log(result);
    res.json(result);
    // app.set("sessionId", session.sessionId);
  });
});
*/

// create a new tokbox session with a corresponding name and write it to the DB. Return the session ID. If a session
// with the given name already exists, return its ID.
app.get(`${API.SESSION_CREATE}/:name`, (req, res) => {
  const sessionName = req.params.name.replace(/[^\w\s]/gi, "");
  // check, if session with that name already exists, otherwise create it in database
  pg.connect(`${DB}?ssl=true`, (err, client, done) => {
    const queryString = "SELECT * FROM public.meetings_v2 where session_name = $1";
    client.query(queryString, [sessionName], (error, result) => {
      done();
      if (error) {
        console.error(error);
        res.send(`Error ${error}`);
      } else {
        // if session does not exits, create it now
        if (result.rows.length === 0) {
          // create session
          createSession(sessionName);
          // return sessionID
          res.json( { sessionId: app.get("sessionId") } );
        } else {
          // return sessionID
          res.json( { sessionId: result.rows[0].session_id } );
        }
      }
    });
  });
});


// return sessionID for given name if it exists in DB. Else return error code 0
app.get(`${API.SESSION_GET}/:name`, (req, res) => {
  const sessionName = req.params.name.replace(/[^\w\s]/gi, "");
  // check, if session with that name already exists
  pg.connect(`${DB}?ssl=true`, (err, client, done) => {
    const queryString = "SELECT * FROM public.meetings_v2 where session_name = $1";
    client.query(queryString, [sessionName], (error, result) => {
      done();
      if (error) {
        console.error(error);
        res.send(`Error ${error}`);
      } else {
        // if session does not exits, return error code
        if (result.rows.length === 0) {
          res.json( { error: 0 } );
          return;
        }
        // return sessionID
        res.json( { sessionId: result.rows[0].session_id } );
      }
    });
  });
});


// Serve static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "..", "build")));

  // Always return the main index.html, so react-router render the route in the client
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
  });
}

module.exports = app;
