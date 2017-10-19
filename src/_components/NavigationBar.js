import React, { Component } from "react";
import PropTypes from "prop-types";
import "./NavigationBar.css";
import NavBarElement from "./NavBarElement";
import info from "../assets/ic_nav_info.svg";
import addPerson from "../assets/ic_nav_add_person.svg";
import videoOff from "../assets/ic_nav_video_off.svg";
import endCall from "../assets/ic_nav_end_call.svg";
import settings from "../assets/ic_nav_settings.svg";

// TODO make Redux Container
export default class NavigationBar extends Component {
  render() {
    return (
      <div className="NavigationBar">
        <NavBarElement icon={ endCall } />
        <NavBarElement icon={ addPerson } />
        <NavBarElement icon={ videoOff } />
        <NavBarElement icon={ settings } />
        <NavBarElement icon={ info } />
      </div>
    );
  }
}

NavigationBar.propTypes = {
};
