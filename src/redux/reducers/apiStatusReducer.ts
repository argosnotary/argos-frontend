import { BEGIN_API_CALL, END_API_CALL, API_CALL_ERROR, ApiCallActionTypes } from "../actions/apiStatusActions";
import { TokenActionTypes, LOGOUT } from "../actions/tokenActions";

export default function apiCallStatusReducer(state = 0, action: ApiCallActionTypes | TokenActionTypes) {
  switch (action.type) {
    case BEGIN_API_CALL:
      return state++;
    case API_CALL_ERROR || END_API_CALL:
      return state--;
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
