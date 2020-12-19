import { LOGOUT, TokenActionTypes } from "./../actions/tokenActions";
import { ProfileActionTypes, LOAD_PROFILE_SUCCESS } from "../actions/profileActions";

export default function userReducer(state = {}, action: ProfileActionTypes | TokenActionTypes) {
  switch (action.type) {
    case LOAD_PROFILE_SUCCESS:
      return { ...state, ...action.profile };
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
