import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import injectStyles from "react-jss";

const IconButton = ({ classes, className, icon }) => (
  <div className={ classNames(classes.root, className) } >
    <img src={ icon } alt="icon" />
  </div>
);

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.object,
};

const styles = {
  root: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
  },
};

export default injectStyles(styles)(IconButton);
