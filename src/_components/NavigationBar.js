import React from "react";
import PropTypes from "prop-types";
import NavBarElement from "./NavBarElement";
import info from "../assets/ic_nav_info.svg";
import addPerson from "../assets/ic_nav_add_person.svg";
import videoOff from "../assets/ic_nav_video_off.svg";
import endCall from "../assets/ic_nav_end_call.svg";
import settings from "../assets/ic_nav_settings.svg";
import injectStyles from "react-jss";
import classNames from "classnames";

const NavigationBar = ({
  classes,
  className,
  toggleVideo,
  disabled,
}) => {
  const onEndCall = () => {
    window.location.href = "http://whipple.io";
  };

  const onAddPersion = () => {
    console.warn("onAddPersion() is not implemented");
  };

  const onSettings = () => {
    console.warn("onSettings() is not implemented");
  };

  const onInfo = () => {
    console.warn("onInfo() is not implemented");
  };

  const elements = [
    { icon: endCall, onClick: onEndCall },
    { icon: addPerson, onClick: onAddPersion },
    { icon: videoOff, onClick: toggleVideo },
    { icon: settings, onClick: onSettings },
    { icon: info, onClick: onInfo },
  ];
  return (
    <div className={ classNames(classes.root, className, {
      [classes.disabled]: disabled,
    }) }
    >
      {!disabled && elements.map(({ icon, onClick }, i) => (
        <NavBarElement
          className={ classes.element }
          icon={ icon }
          onClick={ onClick }
          key={ i }
        />
      ))}
    </div>
  );
};

NavigationBar.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  streamId: PropTypes.string.isRequired,
  toggleVideo: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

NavigationBar.defaultProps = {
  disabled: false,
};

// todo flexible styles from parent via className
const styles = {
  root: {
    height: "44.44%",
    width: "80px",
    borderTopLeftRadius: "20px",
    borderBottomLeftRadius: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    right: 0,
    top: "27.78%",
    padding: "20px 0 20px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  element: {
    flex: "1 1 auto",
  },
  disabled: {
    visibility: "hidden",
  },
};

export default injectStyles(styles)(NavigationBar);
