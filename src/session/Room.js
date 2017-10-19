import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import OT from "@opentok/client";
import ToolBar from "../_components/ToolBar";
import NavigationBar from "../_components/NavigationBar";
import Logo from "../_components/Logo";
import "./Room.css";

// TODO make Redux Container
export default class Room extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // todo a room itself does not create a session, only get it and redirect back, if it does not exist
    // this.props.createSession(this.props.name);
  }

  render() {
    return (
      <div className="Room">
        <h1>{ this.props.name } { this.props.match.params.name }</h1>
        <Logo />
        <ToolBar />

        <NavigationBar />
        <Link to="/">Go Home</Link>
      </div>
    );
  }
}

Room.propTyes = {
  name: PropTypes.string.isRequired,
  createSession: PropTypes.func.isRequired,
  talk: PropTypes.func.isRequired,
};

Room.defaultProps = {
};
