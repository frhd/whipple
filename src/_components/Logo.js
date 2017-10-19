import React, { Component } from "react";
import "./Logo.css";
import logo from "../assets/logo.svg";

export default class Logo extends Component {
  render() {
    return (
      <img className="Logo" src={ logo } />
    );
  }
}
