import React, { Component } from "react";
import PropTypes from "prop-types";
import "./UserCircle.css";
import OT from "@opentok/client";

export default class UserCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publisher: "",
      container: "",
    };
  }
  componentDidMount() {
    const container = document.createElement("div");
    container.classList.add("UserCircle");
    OT.initPublisher(container, (err) => {
      this.props.onError(err);
    });
    this.node.appendChild(container);
  }
  render() {
    return (
      <div ref={ node => (this.node = node) } />
    );
  }
}

UserCircle.propTypes = {
  onError: PropTypes.func.isRequired,
};
