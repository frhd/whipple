import * as type from "./actionTypes";

const initialState = {
  roomId: "",
  error: "",
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case type.ROOM_CREATE_REQUEST:
      return {
        ...state,
      };
    case type.ROOM_CREATE_FAILED:
      return {
        ...state,
        error: action.payload.error,
        sessionId: "",
      };
    case type.ROOM_CREATE_SUCCESSFUL:
      return {
        ...state,
        sessionId: action.payload.sessionId,
        error: "",
      };
    default:
      return initialState;
  }
};
