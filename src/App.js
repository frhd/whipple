import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import session from "./session";
// import OT from "@opentok/client";
import Room from "./session/Room";

export class App extends Component {
  componentWillMount() {
    // this.props.createSession();
    // OT.initPublisher();
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" render={ () => (
          <div>
            <div>Whipple</div>
            <Link to="/room/test">Room with Name "test"</Link>
          </div>
        ) }
        />
        <Route
          strict path="/room/:name"
          component={ Room }
        />
      </div>
    );
  }
}

App.propTyes = {
  createSession: PropTypes.func.isRequired,
};


// selectors and constants
const mapStateToProps = (state) => ({
  sessionId: session.selectors.getSessionId(state),
});

const mapDispatchToProps = (dispatch) => ({
  createSession: () => dispatch(session.actions.createSession()),
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

AppContainer.propTyes = {
  databaseUrl:  PropTypes.string.isRequired,
};

export default withRouter(AppContainer);
