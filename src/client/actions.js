import * as type from "./actionTypes";

export const toggleCamera = () => ({
    type: type.CLIENT_CAMERA_TOGGLE,
    payload: {},
});

const setCamera = (isOn) => ({
    type: type.CLIENT_CAMERA_TOGGLE,
    payload: { cameraOn: isOn },
});

// join or leave queue
export const joinQueue = () => ({
    type: type.CLIENT_QUEUE_JOIN,
    payload: {},
});

export const leaveQueue = () => ({
    type: type.CLIENT_QUEUE_LEAVE,
    payload: {},
});