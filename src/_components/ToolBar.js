import React from "react";
import PropTypes from "prop-types";
import ToolBarElement from "./ToolBarElement";
import finger from "../assets/ic_toolbar_finger.svg";
import thumbsUp from "../assets/ic_toolbar_thumbs_up.svg";
import thumbsDown from "../assets/ic_toolbar_thumbs_down.svg";
import timeBoost from "../assets/ic_toolbar_speak_boost.svg";
import afk from "../assets/ic_toolbar_afk.svg";
import injectStyles from "react-jss";
import classNames from "classnames";

import {
  signalQueueJoin,
  signalThumbsUp,
  signalThumbsDown,
  signalTimeBoost,
  signalAfk,
} from "../room/actions";

const ToolBar = ({
  classes,
  className,
  session,
  streamId,
  disabled,
  // talkAction,
  // thumbsUpAction,
  // thumbsDownAction,
  // timeBoostAction,
  // afkAction,
}) => {
  const elements = [
    { icon: finger, onClick: () => signalQueueJoin(session, streamId) },
    { icon: thumbsUp, onClick: () => signalThumbsUp(session, streamId) },
    { icon: thumbsDown, onClick: () => signalThumbsDown(session, streamId) },
    { icon: timeBoost, onClick: () => signalTimeBoost(session, streamId) },
    { icon: afk, onClick: () => signalAfk(session, streamId) },
  ];
  return (
    <div className={ classNames(classes.root, className, {
      [classes.disabled]: disabled,
    }) }
    >
      {elements.map(({ icon, onClick }, i) => (
        <ToolBarElement
          key={ i }
          icon={ icon }
          onClick={ onClick }
        />
      ))}
    </div>
  );
};

ToolBar.propTypes = {
  streamId: PropTypes.string.isRequired,
  // talkAction: PropTypes.func.isRequired,
  // thumbsUpAction: PropTypes.func.isRequired,
  // thumbsDownAction: PropTypes.func.isRequired,
  // timeBoostAction: PropTypes.func.isRequired,
  // afkAction: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

ToolBar.defaultProps = {
  disabled: false,
};

const styles = {
  root: {
    height: "560px",
    width: "80px",
    position: "absolute",
    top: "170px",
    left: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  disabled: {
    visibilty: "hidden",
  },
};

export default injectStyles(styles)(ToolBar);