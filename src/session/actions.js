import * as type from "./actionTypes";

const sessionCreateRequest = () => ({
  type: type.SESSION_CREATE_REQUEST,
  payload: {},
});

const sessionCreateSuccessful = (sessionId) => ({
  type: type.SESSION_CREATE_SUCCESSFUL,
  payload: { sessionId },
});

const sessionCreateFailed = (error) => ({
  type: type.SESSION_CREATE_FAILED,
  payload: { error },
});

export const createSession = () => (dispatch) =>
  Promise.resolve()
    .then(() => dispatch(sessionCreateRequest()))
    .then(() => fetch("/session/create"))
    .then(({ sessionId }) => dispatch(sessionCreateSuccessful(sessionId)))
    .catch(error => dispatch(sessionCreateFailed(error)));
