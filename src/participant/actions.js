import * as type from "./actionTypes";

export const toggleCamera = () => ({
  type: type.PARTICIPANT_CAMERA_TOGGLE,
  payload: {},
});

const setCamera = (isOn) => ({
  type: type.PARTICIPANT_CAMERA_TOGGLE,
  payload: { cameraOn: isOn },
});

// join or leave queue
export const joinQueue = () => ({
  type: type.PARTICIPANT_QUEUE_JOIN,
  payload: {},
});

export const leaveQueue = () => ({
  type: type.PARTICIPANT_QUEUE_LEAVE,
  payload: {},
});
