import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import room from "./room";
// import OT from "@opentok/client";
import Room from "./room/Room";

export class App extends Component {
  componentWillMount() {
    // this.props.createRoom();
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
          path="/room/:name"
          component={ Room }
        />
      </div>
    );
  }
}

App.propTyes = {
  createRoom: PropTypes.func.isRequired,
};


// selectors and constants
const mapStateToProps = (state) => ({
  roomId: room.selectors.getRoomId(state),
});

const mapDispatchToProps = (dispatch) => ({
  createRoom: () => dispatch(room.actions.createRoom()),
});

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

AppContainer.propTyes = {
  databaseUrl:  PropTypes.string.isRequired,
};

export default withRouter(AppContainer);
