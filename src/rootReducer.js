import { combineReducers } from "redux";
import { reducer } from "react-redux-sweetalert";
import session from "./session";

// redux reducer
export default combineReducers({
  sweetalert: reducer,
  [session.constants.NAME]: session.reducer,
});
