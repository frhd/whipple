import * as type from "./actionTypes";
// const OpenTok = require("opentok");

const createOpenTokSession = () => {
  const TB_KEY = process.env.REACT_APP_TOKBOX_API;
  const TB_SECRET = process.env.REACT_APP_TOKBOX_SECRET;
  // todo tokbox integration
  const OpenTok = {};
  const opentok = new OpenTok(TB_KEY, TB_SECRET);
  opentok.createSession(
    { mediaMode: "routed" },
    (err, session) => {
      if (err) {
        return Promise.reject(err);
      }
      return Promise.resolve(session.sessionId);
    });
};

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
    .then(() => createOpenTokSession())
    .then(sessionId => dispatch(sessionCreateSuccessful(sessionId)))
    .catch(error => dispatch(sessionCreateFailed(error)));
