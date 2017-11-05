import React, { Component } from "react";
import PropTypes from "prop-types";
import IconButton from "./IconButton";
import injectStyles from "react-jss";
import classNames from "classnames";

class NavBarElement extends Component {
  render() {
    const { classes, className } = this.props;
    return (
      <div
        className={ classNames(className, classes.root) }
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

NavBarElement.defaultProps = {
  onClick: () => console.warn("undefined onClick"),
};

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    "&:hover": {
      backgroundColor: "rgba(160, 160, 160, 0.3)",
      cursor: "pointer",
    },
  },
};

export default injectStyles(styles)(NavBarElement);
