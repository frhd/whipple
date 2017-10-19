import React, { Component } from "react";
import PropTypes from "prop-types";
import "./SpeakTime.css";
import UserCircle from "./UserCircle";

// TODO make Redux Container
export default class SpeakTime extends Component {
  render() {
    return (
      <div className="SpeakTime">
        <UserCircle />
      </div>
    );
  }
}

SpeakTime.propTypes = {

};
