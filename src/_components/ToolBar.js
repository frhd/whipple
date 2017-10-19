import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ToolBar.css";
import IconButton from "./IconButton";
import ToolBarElement from "./ToolBarElement";
import finger from "./ic_toolbar_finger.svg";

export default class ToolBar extends Component {
  render() {
    return (
      <div className="ToolBar">
        <ToolBarElement>
          <IconButton icon={ finger } />
        </ToolBarElement>
      </div>
    );
  }
}

ToolBar.propTypes = {
  talkAction: PropTypes.func.isRequired,
};

ToolBar.defaultProps = {
  talkAction: () => console.error("talkAction() is undefined"),
};
