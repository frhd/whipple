import React, { Component } from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import "./ToolBarElement.css";

export default class ToolBarElement extends Component {
  render() {
    return (
      <div className="ToolBarElement">
        <IconButton icon={ this.props.icon } />
      </div>
    );
  }
}

ToolBarElement.propTypes = {
  icon: PropTypes.string.isRequired,
};
