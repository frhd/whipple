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

const TB_KEY = process.env.REACT_APP_TOKBOX_API;
const TB_SECRET = process.env.REACT_APP_TOKBOX_SECRET;
const DATABASE_URL = process.env.REACT_APP_DATABASE_URL;

const middleware = isDev() ?
  applyMiddleware(thunk, logger) :
  applyMiddleware(thunk);

const store = createStore(rootReducer, middleware);
const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <App
        tokBoxApiKey={ TB_KEY }
        tokBoxSecret={ TB_SECRET }
        databaseUrl={ DATABASE_URL }
      />
    </Router>
  </Provider>,
  document.getElementById("root"),
);
