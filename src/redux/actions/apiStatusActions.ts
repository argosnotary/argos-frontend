export const BEGIN_API_CALL = "BEGIN_API_CALL";
export const END_API_CALL = "END_API_CALL";
export const API_CALL_ERROR = "API_CALL_ERROR";

export interface BeginApiCallAction {
  type: typeof BEGIN_API_CALL;
}

export interface EndApiCallAction {
  type: typeof END_API_CALL;
}

export interface ApiCallErrorAction {
  type: typeof API_CALL_ERROR;
}

export function beginApiCall(): BeginApiCallAction {
  return { type: BEGIN_API_CALL };
}

export function endApiCall(): EndApiCallAction {
  return { type: END_API_CALL };
}

export function apiCallError(): ApiCallErrorAction {
  return { type: API_CALL_ERROR };
}

export type ApiCallActionTypes = BeginApiCallAction | EndApiCallAction | ApiCallErrorAction;
