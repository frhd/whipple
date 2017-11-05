import React from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import injectStyles from "react-jss";
import classNames from "classnames";

const ToolBarElement = ({ classes, className, icon, onClick }) => (
  <div
    className={ classNames(classes.root, className) }
    onClick={ onClick }
  >
    <IconButton icon={ icon } />
  </div>
);

ToolBarElement.propTypes = {
  icon: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.object,
  onClick: PropTypes.func.isRequired,
};

const styles = {
  root: {
    height: "80px",
    width: "80px",
    borderRadius: "100%",
    border: "2px solid #FFFFFF",
    "&:hover": {
      backgroundColor: "rgba(160,160,160,0.3)",
      cursor: "pointer",
    },
  },
};

export default injectStyles(styles)(ToolBarElement);
