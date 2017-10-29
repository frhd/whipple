import * as type from "./actionTypes";

const initialState = {
  publisher: null,
  cameraOn: true,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case type.PARTICIPANT_QUEUE_JOIN:
      return {
        ...state,
        // do stuff with the queue
      };

    case type.PARTICIPANT_QUEUE_LEAVE:
      return {
        ...state,
        // do stuff with the queue
      };
    case type.PARTICIPANT_CAMERA_TOGGLE:
      return {
        ...state,
        cameraOn: !state.cameraOn,
      };
    default:
      return initialState;
  }
};
