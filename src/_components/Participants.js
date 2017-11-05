import React from "react";
import PropTypes from "prop-types";
import UserCircle from "./UserCircle";
import injectStyles from "react-jss";
import classNames from "classnames";

const Participants = ({
  audio,
  video,
  clientName,
  className,
  classes,
  streams,
  onPublisherCreated,
  ...other
}) => (
  <div className={ classNames(className, classes.root) } >
    <div className={ classes.wrapper } >
      <UserCircle
        type="publisher"
        withVideo={ video }
        withAudio={ audio }
        name={ clientName }
        onCreated={ onPublisherCreated }
        { ...other }
      />
      {streams.map((stream, index) => (
        <UserCircle
          key={ index }
          type="subscriber"
          withVideo
          withAudio={ false }
          stream={ stream }
          { ...other }
        />
      ))}
    </div>
  </div>
);

Participants.propTypes = {
  video: PropTypes.bool.isRequired,
  audio: PropTypes.bool.isRequired,
  clientName: PropTypes.string.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  streams: PropTypes.array.isRequired,
  onPublisherCreated: PropTypes.func.isRequired,
};

const styles = {
  root: {
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
};

export default injectStyles(styles)(Participants);
