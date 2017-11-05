import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Router } from "react-router";

// eslint-disable-next-line import/no-extraneous-dependencies
import createBrowserHistory from "history/createBrowserHistory";

const history = createBrowserHistory();
const DATABASE_URL = process.env.REACT_APP_DATABASE_URL;
ReactDOM.render(
  <Router history={ history }>
    <App databaseUrl={ DATABASE_URL } />
  </Router>,
  document.getElementById("root"),
);
