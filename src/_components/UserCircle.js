import React, { Component } from "react";
import PropTypes from "prop-types";
import { OTPublisher, OTSubscriber } from "opentok-react";
import injectStyles from "react-jss";

class UserCircle extends Component {
  render() {
    const {
      withVideo,
      withAudio,
      name,
      classes,
      type,
      onCreated,
      ...other
    } = this.props;

    const isPublisher = type === "publisher";
    const displayName = isPublisher ? name : this.props.stream.name;

    const defProperties = {
      insertMode:       "replace",
      width:            "200px",
      height:           "175px",
      showControls:     false,
    };

    return (
      <div className={ classes.publisher } >
        {isPublisher &&
          <OTPublisher
            key={ 1 }
            session={ this.props.session }
            properties={{
              publishAudio:     withAudio,
              publishVideo:     withVideo,
              eventHandlers:    this.events,
              insertDefaultUI:  true,
              name:             displayName,
              ...defProperties,
            }}
            eventHandlers={{
              streamCreated: onCreated,
            }}
          />
        }
        {!isPublisher &&
          <OTSubscriber
            key={ 1 }
            properties={{
              subscribeToAudio: withAudio,
              subscribeToVideo: withVideo,
              ...defProperties,
            }}
            { ...other }
          />
        }
        <div className={ classes.pName } key={ 2 } >
          {displayName}
        </div>
      </div>
    );
  }
}

UserCircle.propTypes = {
  withVideo: PropTypes.bool.isRequired,
  withAudio: PropTypes.bool.isRequired,
  name: PropTypes.string,
  type: PropTypes.oneOf(["publisher", "subscriber"]).isRequired,
};

UserCircle.defaultProps = {
  type: "publisher",
};

const styles = {
  root: {
  },
  pName: {
    textAlign: "center",
    height: "25px",
    background: "gray",
  },
  publisher: {
    height: "200px",
    width: "200px",
    borderRadius: "50%",
    overflow: "hidden",
  },
};

export default injectStyles(styles)(UserCircle);
