import { combineReducers } from "redux";
import token from "./tokenReducer";
import profile from "./profileReducer";
import key from "./keyReducer";
import apiCallsInProgress from "./apiStatusReducer";

const rootReducer = combineReducers({
  token,
  profile,
  key,
  apiCallsInProgress
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
