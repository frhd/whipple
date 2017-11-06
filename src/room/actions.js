import API from "../shared/constants";
export const SIGNAL_TALK = "TALK";
export const SIGNAL_THUMBS_UP = "THUMBS_UP";
export const SIGNAL_THUMBS_DOWN = "THUMBS_DOWN";
export const SIGNAL_TIME_BOOST = "TIME_BOOST";
export const SIGNAL_AFK = "AFK";
export const SIGNAL_QUEUE_UPDATE = "QUEUE_UPDATE";
export const SIGNAL_USER_JOINED = "USER_JOINED";

export const createRoom = (name) => (
  new Promise((resolve, reject) => {
    fetch(API.SESSION_CREATE, {
      method:   "post",
      body:     JSON.stringify({ name }),
      headers:  {
        "Content-Type": "application/json",
        Accept:         "application/json",
      },
    })
      .then(res => res.status >= 400 ?
        reject({ status: res.status, message: res.statusText }) : res.json())
      .then(json => json.sessionId ?
        resolve(json.sessionId) : reject({ status: 200, message: "could not obtain session id" }))
      .catch(err => reject(err));
  }));

export const joinRoom = (name) => (
  new Promise((resolve, reject) => {
    fetch(API.ROOM_JOIN, {
      method:   "post",
      body:     JSON.stringify({ name }),
      headers:  {
        "Content-Type": "application/json",
        Accept:         "application/json",
      },
    })
      .then(res => res.status >= 400 ? 
        reject({ status: res.status, message: res.statusText }) : res.json())
      .then(json => json.token ?
        resolve(json.token) : reject({ message: "could not obtain token" }))
      .catch(err => reject(err));
  }));

export const signalTalk = (session, streamId) => {
  console.log("signaling talk action", streamId);
  session.signal({
    data: streamId,
    type: SIGNAL_TALK,
  });
};

export const signalThumbsUp = (session, streamId) => {
  console.log("signaling signalThumbsUp", streamId);
  session.signal({
    data: streamId,
    type: SIGNAL_THUMBS_UP,
  });
};

export const signalThumbsDown = (session, streamId) => {
  session.signal({
    data: streamId,
    type: SIGNAL_THUMBS_DOWN,
  });
};

export const signalTimeBoost = (session, streamId) => {
  session.signal({
    data: streamId,
    type: SIGNAL_TIME_BOOST,
  });
};

export const signalAfk = (session, streamId) => {
  session.signal({
    data: streamId,
    type: SIGNAL_AFK,
  });
};

export const signalUserJoined = (session, streamId) => {
  session.signal({
    data: streamId,
    type: SIGNAL_USER_JOINED,
  });
};

export const signalQueueUpdate = (session, queue, target) => {
  session.signal({
    data: queue,
    type: SIGNAL_QUEUE_UPDATE,
  });
};
