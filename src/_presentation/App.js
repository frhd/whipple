import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router";
import { Link } from "react-router-dom";

export default class App extends Component {
  componentWillMount() {
    this.props.createSession();
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
        <Route strict path="/room/:roomName" render={ ({ match }) => (<div>Room { match.params.roomName } <Link to="/">Go Home</Link></div>) } />
      </div>
    );
  }
}

App.propTyes = {
  createSession: PropTypes.func.isRequired,
};
