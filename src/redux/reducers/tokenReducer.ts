import { TokenActionTypes, LOGIN, LOGOUT, REFRESH_TOKEN_SUCCESS } from "../actions/tokenActions";

export default function userReducer(state = {}, action: TokenActionTypes) {
  switch (action.type) {
    case LOGIN:
      return { ...state, ...action.token };
    case LOGOUT:
      return {};
    case REFRESH_TOKEN_SUCCESS:
      return { ...state, ...action.token };
    default:
      return state;
  }
}
