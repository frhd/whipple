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
      me:       {},
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
        this.state.session.signal({ type: "DISCONNECT", data: this.state.me.stream.id });
        this.setState({ connected: false, session: {} });
      },
      streamCreated: (e) => {
        this.onStreamCreated(e);
      },
      streamDestroyed: (e) => {
        this.onStreamDestroyed(e);
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
    this.setState((prevState) => ({
      users: [
        ...prevState.users,
        { stream: event.stream, joinedAt: new Date() },
      ],
    }));
  }

  onStreamDestroyed(event) {
    const stream = event.stream;
    this.setState((prevState) => {
      const index =
        prevState.users.findIndex((user) => (user.stream.id === stream.id));
      prevState.users.splice(index, 1);
      prevState.queue.splice(prevState.queue.indexOf(stream.id), 1);
      return {
        users: prevState.users,
        queue: prevState.queue,
      };
    });
    if (this.isMaster()) {
      const { session, queue } = this.state;
      actions.signalQueueUpdate(session, JSON.stringify(queue));
    }
  }

  onPublisherCreated(event) {
    this.setState({ me: { stream: event.stream, joinedAt: new Date() } });
    actions.signalUserJoined(this.state.session, event.stream.id);
  }

  onTalkActionReceived(userId) {
    const queue = this.state.queue;
    const index = queue.indexOf(userId);
    if (index > -1) {
      queue.splice(index, 1);
      this.setState({ queue });
    } else {
      this.setState({
        queue: [...queue, userId],
      });
    }
  }

  onUserJoinedReceived(userId, asMaster) {
    const { queue, session } = this.state;
    if (asMaster) {
      console.log("sending queue update to joined user", userId);
      actions.signalQueueUpdate(session, JSON.stringify(queue), userId);
    }
  }

  toggleVideo() {
    this.setState(prevState => ({ video: !prevState.video }));
  }

  isMaster() {
    const { me, users } = this.state;
    const participants = [me, ...users];
    const usersByJoinedDate =
      participants.sort((a, b) => (a.joinedAt - b.joinedAt));
    const master = usersByJoinedDate[0];
    const asMaster = master.stream && me.stream.id === master.stream.id;
    return asMaster;
  }

  receiveSignal(signal) {
    console.log("MASTER?", this.isMaster());
    const asMaster = this.isMaster();
    switch (signal.type) {
      case "signal:TALK":
        this.onTalkActionReceived(signal.data, asMaster);
        break;
      case `signal:${actions.SIGNAL_USER_JOINED}`:
        this.onUserJoinedReceived(signal.data, asMaster);
        break;
      case `signal:${actions.SIGNAL_QUEUE_UPDATE}`:
        console.log("updating queue from", this.state.queue, "to", JSON.parse(signal.data));
        this.setState({ queue: JSON.parse(signal.data) });
        break;
      default:
        console.warn("Signal received, but no action defined for", signal.type);
        break;
    }
  }

  speaker() {
    const { users, queue, me } = this.state;
    const speakerId = queue[0];
    const all = [me, ...users];
    const r = all.find((u) => (u.stream && u.stream.id === speakerId));
    return r ? r.stream : r;
  }

  render() {
    const { roomId, token, me, video, audio, queue, connected } = this.state;
    const { classes } = this.props;
    const myStreamId = me.stream ? me.stream.id : undefined;

    const speaker = this.speaker();
    console.log("speaker", speaker, "me", myStreamId);
    return (
      <div className={ classes.room }>
        <Logo />
        {token &&
          <OTSession
            apiKey={ process.env.REACT_APP_TOKBOX_API }
            sessionId={ roomId }
            token={ token }
            eventHandlers={ this.sessionEvents }
          >
            <p>{ queue }</p>
            <p>speaker: { speaker && speaker.name }</p>
            <h1>{ this.props.match.params.name }</h1>
            <Participants
              audio={ audio }
              video={ video }
              clientName={ this.state.userName }
              className={ classes.participants }
              onPublisherCreated={ this.onPublisherCreated }
              streams={ this.state.users.map(user => user.stream) }
            />
            <NavigationBar
              streamId={ myStreamId }
              toggleVideo={ this.toggleVideo }
              disabled={ !connected }
            />
            <ToolBar
              streamId={ myStreamId }
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
