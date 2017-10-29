import * as type from "./actionTypes";

// join or leave queue
export const joinQueue = () => ({
  type: type.QUEUE_JOIN,
  payload: {},
});

export const leaveQueue = () => ({
  type: type.QUEUE_LEAVE,
  payload: {},
});
