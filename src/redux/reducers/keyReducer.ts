import { Key } from "../../util/security";
import {
  CREATE_KEY_SUCCESS,
  KEY_GENERATED,
  GET_ACTIVE_KEY_SUCCESS,
  ActionTypes,
  REMOVE_PASSWORD_FROM_KEY
} from "./../actions/actionTypes";

export default function keyReducer(state = {} as Key, action: ActionTypes) {
  switch (action.type) {
    case GET_ACTIVE_KEY_SUCCESS:
      return { ...state, ...action.key };
    case CREATE_KEY_SUCCESS:
      return state;
    case KEY_GENERATED:
      return { ...state, ...action.key };
    case REMOVE_PASSWORD_FROM_KEY:
      const key = state.key;
      return { key };
    default:
      return state;
  }
}
