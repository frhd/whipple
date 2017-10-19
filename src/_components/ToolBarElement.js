import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ToolBarElement.css";

export default class ToolBarElement extends Component {
  render() {
    return (
      <div className="ToolBarElement">
        { this.props.children }
      </div>
    );
  }
}

ToolBarElement.propTypes = {
  children: PropTypes.node.isRequired,
};
