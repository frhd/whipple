import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Route, withRouter } from "react-router";
import { Link } from "react-router-dom";

class App extends PureComponent {
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

App.propTypes = {
  tokBoxApiKey: PropTypes.string.isRequired,
  tokBoxSecret: PropTypes.string.isRequired,
  databaseUrl:  PropTypes.string.isRequired,
};

export default withRouter(App);
