import { KeyState } from "./../actions/keyActions";
import { LOGOUT, TokenActionTypes } from "./../actions/tokenActions";
import { Key } from "../../util/security";
import {
  CREATE_KEY_SUCCESS,
  KEY_GENERATED,
  GET_ACTIVE_KEY_SUCCESS,
  KeyActionTypes,
  REMOVE_PASSWORD_FROM_KEY
} from "../actions/keyActions";

export default function keyReducer(state = {} as KeyState, action: KeyActionTypes | TokenActionTypes): KeyState {
  switch (action.type) {
    case GET_ACTIVE_KEY_SUCCESS:
      return { ...state, ...action.key };
    case CREATE_KEY_SUCCESS:
      return state;
    case KEY_GENERATED:
      return { ...state, ...action.key };
    case REMOVE_PASSWORD_FROM_KEY:
      return { key: state.key };
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
