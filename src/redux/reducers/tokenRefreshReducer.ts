import { TokenRefreshActionTypes } from "./../actions/tokenRefreshActions";
import { BEGIN_TOKEN_REFRESHING, END_TOKEN_REFRESHING } from "../actions/tokenRefreshActions";
import { TokenActionTypes, LOGOUT } from "../actions/tokenActions";

export default function tokenRefreshReducer(state = false, action: TokenRefreshActionTypes | TokenActionTypes) {
  switch (action.type) {
    case BEGIN_TOKEN_REFRESHING:
      return true;
    case END_TOKEN_REFRESHING:
      return false;
    case LOGOUT:
      return false;
    default:
      return state;
  }
}
