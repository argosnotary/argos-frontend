import { ServiceAccountKeyPair } from "./../../api/api";
import { Key } from "./../../util/security/index";
import { generateKey } from "../../util/security";
import { beginApiCall, endApiCall } from "./apiStatusActions";

export const GET_ACTIVE_KEY_SUCCESS = "GET_ACTIVE_KEY_SUCCESS";
export const KEY_GENERATED = "KEY_GENERATED";
export const CREATE_KEY_SUCCESS = "CREATE_KEY_SUCCESS";
export const REMOVE_PASSWORD_FROM_KEY = "REMOVE_PASSWORD_FROM_KEY";

export interface GetActiveKeySuccessAction {
  type: typeof GET_ACTIVE_KEY_SUCCESS;
  key: KeyState;
}

export interface PostKeySuccessAction {
  type: typeof CREATE_KEY_SUCCESS;
}

export interface KeyGeneratedAction {
  type: typeof KEY_GENERATED;
  key: KeyState;
}

export interface RemovePasswordFromKeyAction {
  type: typeof REMOVE_PASSWORD_FROM_KEY;
}

export type KeyActionTypes =
  | GetActiveKeySuccessAction
  | PostKeySuccessAction
  | KeyGeneratedAction
  | RemovePasswordFromKeyAction;

export function getActiveKeySuccess(key: KeyState): GetActiveKeySuccessAction {
  return { type: GET_ACTIVE_KEY_SUCCESS, key };
}

export function postKeySuccess(): PostKeySuccessAction {
  return { type: CREATE_KEY_SUCCESS };
}

export function keyGenerated(key: KeyState): KeyGeneratedAction {
  return { type: KEY_GENERATED, key };
}

export function removePassword(): RemovePasswordFromKeyAction {
  return { type: REMOVE_PASSWORD_FROM_KEY };
}

export interface KeyState {
  key?: ServiceAccountKeyPair;
  password?: string;
}

export function getActiveKey(axiosApiCallActiveKey: any) {
  return function (dispatch: any, getState: any) {
    dispatch(beginApiCall());
    return axiosApiCallActiveKey(getState().token)
      .then((response: any) => {
        dispatch(endApiCall());
        dispatch(getActiveKeySuccess({ key: { ...response.data } } as KeyState));
      })
      .catch((error: any) => {
        dispatch(endApiCall());
        throw error;
      });
  };
}

export function postKey(axiosApiCallCreateKey: any, key: Key) {
  return function (dispatch: any, getState: any) {
    return axiosApiCallCreateKey(getState().token, key.key)
      .then((response: any) => {
        dispatch(postKeySuccess());
      })
      .catch((error: any) => {
        throw error;
      });
  };
}

export function createKey(axiosApiCallActiveKey: any) {
  return function (dispatch: any) {
    dispatch(beginApiCall());
    return generateKey(true)
      .then((key: Key) => {
        dispatch(keyGenerated({ ...key } as KeyState));
        dispatch(postKey(axiosApiCallActiveKey, key));
        dispatch(endApiCall());
      })
      .catch((error: any) => {
        dispatch(endApiCall());
        throw error;
      });
  };
}
