import React, { Component } from "react";
import PropTypes from "prop-types";
import "./IconButton.css";

export default class IconButton extends Component {
  render() {
    return (
      <div className="IconButton">
        <img src={ this.props.icon } />
      </div>
    );
  }
}

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
};
