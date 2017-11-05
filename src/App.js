import React from "react";
import { Route } from "react-router";
import Room from "./room/Room";

const App = () => (
  <Route
    exact path="/room/:name"
    component={ Room }
  />
);

export default App;
