import { BEGIN_API_CALL, END_API_CALL, API_CALL_ERROR } from "./../actions/actionTypes";

export default function apiCallStatusReducer(state = 0, action: any) {
  if (action.type == BEGIN_API_CALL) {
    return state++;
  } else if (action.type === API_CALL_ERROR || action.type === END_API_CALL) {
    return state--;
  }

  return state;
}
