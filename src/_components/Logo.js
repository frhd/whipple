import React from "react";
import logo from "../assets/logo.svg";
import injectStyles from "react-jss";

const Logo = ({ classes }) => (
  <img className={ classes.root } src={ logo } alt="logo" />
);

const styles = {
  root: {
    position: "fixed",
    height: "56px",
    width: "200px",
    right: "20px",
    top: "16px",
  },
};

export default injectStyles(styles)(Logo);
