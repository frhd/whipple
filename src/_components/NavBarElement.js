import React, { Component } from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import "./NavBarElement.css";

export default class NavBarElement extends Component {
  render() {
    return (
      <div className="NavBarElement"
          onClick={ this.props.onClick }
      >
        <IconButton icon={ this.props.icon } />
      </div>
    );
  }
}

NavBarElement.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
