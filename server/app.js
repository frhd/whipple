const express = require("express");
const path = require("path");
const OpenTok = require("opentok");
const pg = require("pg");
const API = require("../src/shared/constants");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const API_KEY = process.env.REACT_APP_TOKBOX_API;
const SECRET = process.env.REACT_APP_TOKBOX_SECRET;
const DB = process.env.REACT_APP_DATABASE_URL;
const opentok = new OpenTok(API_KEY, SECRET);

// helper functions
const findRoomByName = (name) => (
  new Promise((resolve, reject) => {
    const r = name.replace(/[^\w\s]/gi, "");
    const connectionString = `${DB}?ssl=true`;
    const client = new pg.Client({ connectionString });
    client.connect();
    const queryString = "SELECT * FROM public.meetings_v2 where session_name = $1";
    client.query(queryString, [r])
      .then(response => {
        client.end();
        const len = response.rows.length;
        if (len === 1) {
          resolve(response.rows[0]);
        } else if (len === 0) {
          reject("room_not_found");
        } else {
          reject("invalid_room_count");
        }
      })
      .catch(error => {
        console.error(error);
        client.end();
        reject(error);
      });
  }));

const roomExists = (roomName) => (new Promise((resolve) => {
  findRoomByName(roomName)
    .then(() => resolve(true))
    .catch(error => {
      resolve(error !== "room_not_found");
    });
}));

const generateNewSessionID = () =>
  (new Promise((resolve, reject) => {
    opentok.createSession({ mediaMode: "routed" },
      (err, session) => {
        if (err) {
          reject(err);
        }
        resolve(session.sessionId);
      });
  }));

// TODO resolve deprecation warning
// TODO change to promise
// creates a session with a given name
function createSession(sessionName, sessionId) {
  if (sessionId !== undefined) {
    console.log("Session ID " , sessionId);
    pg.connect(`${DB}?ssl=true`, (err, client, done) => {
      const queryString = "INSERT into public.meetings_v2 (session_id, session_name, audio_only) VALUES($1, $2, $3)";
      console.log("query", queryString);
      client.query(queryString, [sessionId, sessionName, false],
        (error) => {
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

// create a new tokbox session with a corresponding name and write it to the DB. Return the session ID. If a session
// with the given name already exists, return its ID.
app.post(`${API.SESSION_CREATE}`, (req, res) => {
  const sessionName = req.body.name;
  // check, if session with that name already exists, otherwise create it in database
  roomExists(sessionName)
    .then(exists => {
      if (!exists) {
        generateNewSessionID()
          .then(sessionId => {
            createSession(sessionName, sessionId);
            return sessionId;
          })
          .then(sessionId => res.json({ sessionId }))
          .catch(error => res.status(500).json({ error }));
      } else {
        res.status(500).json({ error: "room_not_created" });
      }
    }).catch(error => res.status(500).json({ error }));
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
          res.json( { error: "room_not_exist" } );
          return;
        }
        // return sessionID
        res.json( { sessionId: result.rows[0].session_id } );
      }
    });
  });
});

app.post(`${API.ROOM_JOIN}/`, (request, response) => {
  const name = request.body.name;
  findRoomByName(name)
    .then(room => {
      const sessionId = room.session_id;
      const token = opentok.generateToken(sessionId);
      response.json({ sessionId, token });
    })
    .catch(error => response.status(500).json({ error }));
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
