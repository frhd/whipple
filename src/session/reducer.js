import * as type from "./actionTypes";

const initialState = {
  sessionId: "",
  error: "",
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case type.SESSION_CREATE_REQUEST:
      return {
        ...state,
      };
    case type.SESSION_CREATE_FAILED:
      return {
        ...state,
        error: action.payload.error,
        sessionId: "",
      };
    case type.SESSION_CREATE_SUCCESSFUL:
      return {
        ...state,
        sessionId: action.payload.sessionId,
        error: "",
      };
    default:
      return initialState;
  }
};
