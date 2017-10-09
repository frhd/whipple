import React from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router";
import { App } from "./App";

describe("App Test", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      withRouter(<App tokBoxApiKey="test-key" tokBoxSecret="test-secret" />),
      div);
  });
});
