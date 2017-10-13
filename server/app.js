const express = require("express");
const path = require("path");
const OpenTok = require("opentok");

const app = express();

app.get("/session/create", (req, res) => {
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

// Serve static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "..", "build")));

  // Always return the main index.html, so react-router render the route in the client
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
  });
}

module.exports = app;
