import React, { Component } from "react";
import PropTypes from "prop-types";
import "./ToolBar.css";
import ToolBarElement from "./ToolBarElement";
import finger from "../assets/ic_toolbar_finger.svg";
import thumbsUp from "../assets/ic_toolbar_thumbs_up.svg";
import thumbsDown from "../assets/ic_toolbar_thumbs_down.svg";
import timeBoost from "../assets/ic_toolbar_speak_boost.svg";
import afk from "../assets/ic_toolbar_afk.svg";

// TODO make Redux Container
export default class ToolBar extends Component {
  render() {
    return (
      <div className="ToolBar">
        <ToolBarElement icon={ finger } />
        <ToolBarElement icon={ thumbsUp } />
        <ToolBarElement icon={ thumbsDown } />
        <ToolBarElement icon={ timeBoost } />
        <ToolBarElement icon={ afk } />
      </div>
    );
  }
}

ToolBar.propTypes = {
  talkAction: PropTypes.func.isRequired,
};

ToolBar.defaultProps = {
};
