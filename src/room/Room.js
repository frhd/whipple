import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";
import ToolBar from "../_components/ToolBar";
import NavigationBar from "../_components/NavigationBar";
import Logo from "../_components/Logo";
import Participants from "../_components/Participants";
import { OTSession } from "opentok-react";
import injectStyles from "react-jss";
import * as actions from "./actions";

// required import for client interaction
// eslint-disable-next-line
import OT from "@opentok/client"; 

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      me:       "",
      userName: "Jasper",
      users:    [],
      roomId:   "",
      token:    "",
      audio:    false,
      video:    true,
      queue:    [],
      session:  {},
    };

    this.streamCreated = this.onStreamCreated.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
    this.onPublisherCreated = this.onPublisherCreated.bind(this);

    this.sessionEvents = {
      sessionConnected: (s) => {
        this.setState({ connected: true, session: s.target });
      },
      sessionDisconnected: () => {
        this.setState({ connected: false, session: {} });
      },
      streamCreated: (e) => {
        this.onStreamCreated(e);
      },
      signal: (signal) => {
        this.receiveSignal(signal);
      },
    };
  }

  componentWillMount() {
    const { match } = this.props;
    const name = match.params.name;
    Promise.resolve()
      .then(() => actions.createRoom(name))
      .then(roomId => this.setState({ roomId }))
      .then(() => actions.joinRoom(name))
      .then(token => this.setState({ token }))
      .catch((err) => console.error("Could not connect to room", err));
  }

  onStreamCreated(event) {
    this.setState({
      users: [...this.state.users, event.stream],
    });
  }

  onPublisherCreated(event) {
    this.setState({ me: event.stream.id });
    actions.signalUserJoined(this.state.session, event.stream.id);
  }

  onTalkActionReceived(user) {
    const queue = this.state.queue;
    const index = queue.indexOf(user);
    if (index > -1) {
      queue.splice(index, 1);
      this.setState({ queue });
    } else {
      this.setState({
        queue: [...queue, user],
      });
    }
  }

  toggleVideo() {
    this.setState(prevState => ({ video: !prevState.video }));
  }

  receiveSignal(signal) {
    switch (signal.type) {
      case "signal:TALK":
        this.onTalkActionReceived(signal.data);
        break;
      default:
        console.warn("Signal received, but no action defined for", signal.type);
        break;
    }
  }

  render() {
    const { roomId, token, me, video, audio, queue, connected } = this.state;
    const { classes } = this.props;
    return (
      <div className={ classes.room }>
        <Logo />
        <p>{ queue }</p>
        {token &&
          <OTSession
            apiKey={ process.env.REACT_APP_TOKBOX_API }
            sessionId={ roomId }
            token={ token }
            eventHandlers={ this.sessionEvents }
          >
            <h1>{ this.props.match.params.name }</h1>
            <Participants
              audio={ audio }
              video={ video }
              clientName={ this.state.userName }
              className={ classes.participants }
              onPublisherCreated={ this.onPublisherCreated }
            />
            <NavigationBar
              streamId={ me }
              toggleVideo={ this.toggleVideo }
              disabled={ !connected }
            />
            <ToolBar
              streamId={ me }
              disabled={ !connected }
            />
          </OTSession>
        }
        { this.state.err && <Redirect to="/" /> }
      </div>
    );
  }
}

Room.propTyes = {
  classes: PropTypes.any.isRequired,
};

Room.defaultProps = {
};

const styles = {
  room: {
    margin: 0,
    padding: 0,
  },
  participantsContainer: {
    position: "",
    bottom: 0,
  },
  participants:  {
    position: "absolute",
    bottom: 0,
    width: "80%",
    left: "10%",
    right: "10%",
  },
};

export default injectStyles(styles)(Room);
