import { combineReducers } from "redux";
import token from "./tokenReducer";
import profile from "./profileReducer";
import key from "./keyReducer";
import apiCallsInProgress from "./apiStatusReducer";
import role from "./roleReducer";
import refreshing from "./tokenRefreshReducer";

const rootReducer = combineReducers({
  token,
  profile,
  key,
  apiCallsInProgress,
  role,
  refreshing
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
