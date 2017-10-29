import { combineReducers } from "redux";
import { reducer } from "react-redux-sweetalert";
import room from "./room";
import participant from "./participant";

// redux reducer
export default combineReducers({
  sweetalert: reducer,
  [room.constants.NAME]: room.reducer,
  [participant.constants.NAME]: participant.reducer,
});
