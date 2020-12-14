import { BEGIN_API_CALL, END_API_CALL, API_CALL_ERROR } from "./actionTypes";

export function beginApiCall() {
  return { type: BEGIN_API_CALL };
}

export function endApiCall() {
  return { type: END_API_CALL };
}

export function apiCallError() {
  return { type: API_CALL_ERROR };
}
