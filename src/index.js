import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { logger } from "redux-logger";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./rootReducer";
import { Router } from "react-router";

// eslint-disable-next-line import/no-extraneous-dependencies
import createBrowserHistory from "history/createBrowserHistory";

const isDev = () => process.env.NODE_ENV !== "production";

const middleware = isDev() ?
  applyMiddleware(thunk, logger) :
  applyMiddleware(thunk);

const store = createStore(rootReducer, middleware);
const history = createBrowserHistory();
const DATABASE_URL = process.env.REACT_APP_DATABASE_URL;
ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <App databaseUrl={ DATABASE_URL } />
    </Router>
  </Provider>,
  document.getElementById("root"),
);
