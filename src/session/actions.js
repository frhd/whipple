import * as type from "./actionTypes";
import API from "../shared/constants";
import fetch from "isomorphic-fetch";
import * as selector from "./selectors";

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

export const createSession = (name) => (dispatch) =>
  Promise.resolve()
    .then(() => dispatch(sessionCreateRequest()))
    .then(() => fetch(`${API.SESSION_GET}/${name}`)
      .then(response => response.json(), error => console.error("err", error))
      .then(json => dispatch(sessionCreateSuccessful(json))))
    .catch(error => dispatch(sessionCreateFailed(error)));
