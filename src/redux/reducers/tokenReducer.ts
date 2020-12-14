import { ActionTypes, LOGIN, LOGOUT, REFRESH_TOKEN_SUCCESS, LOAD_PROFILE_SUCCESS } from "../actions/actionTypes";

export default function userReducer(state = {}, action: ActionTypes) {
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
