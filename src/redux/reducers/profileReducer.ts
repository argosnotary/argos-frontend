import { ActionTypes, LOGIN, LOGOUT, REFRESH_TOKEN_SUCCESS, LOAD_PROFILE_SUCCESS } from "../actions/actionTypes";

export default function userReducer(state = {}, action: ActionTypes) {
  switch (action.type) {
    case LOAD_PROFILE_SUCCESS:
      const newState = { ...state, ...action.profile };
      return newState;
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
