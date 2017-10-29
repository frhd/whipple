import * as type from "./actionTypes";
import API from "../shared/constants";
import fetch from "isomorphic-fetch";

const roomCreateRequest = () => ({
  type: type.ROOM_CREATE_REQUEST,
  payload: {},
});

const roomCreateSuccessful = (roomId) => ({
  type: type.ROOM_CREATE_SUCCESSFUL,
  payload: { roomId },
});

const roomCreateFailed = (error) => ({
  type: type.ROOM_CREATE_FAILED,
  payload: { error },
});

export const createRoom = (name) => (dispatch) =>
  Promise.resolve()
    .then(() => dispatch(roomCreateRequest()))
    .then(() => fetch(`${API.SESSION_GET}/${name}`)
      .then(response => response.json(), error => console.error("err", error))
      .then(json => dispatch(roomCreateSuccessful(json))))
    .catch(error => dispatch(roomCreateFailed(error)));
