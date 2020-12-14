import { Key } from "./../../util/security/index";
import {
  GetActiveKeySuccessAction,
  GET_ACTIVE_KEY_SUCCESS,
  KeyGeneratedAction,
  PostKeySuccessAction,
  KEY_GENERATED,
  CREATE_KEY_SUCCESS,
  RemovePasswordFromKeyAction,
  REMOVE_PASSWORD_FROM_KEY
} from "./actionTypes";

import { beginApiCall, endApiCall } from "./apiStatusActions";
import { generateKey } from "../../util/security";
import { refreshToken } from "./userActions";

export function getActiveKeySuccess(key: Key): GetActiveKeySuccessAction {
  return { type: GET_ACTIVE_KEY_SUCCESS, key };
}

export function postKeySuccess(): PostKeySuccessAction {
  return { type: CREATE_KEY_SUCCESS };
}

export function keyGenerated(key: Key): KeyGeneratedAction {
  return { type: KEY_GENERATED, key };
}

export function removePassword(): RemovePasswordFromKeyAction {
  return { type: REMOVE_PASSWORD_FROM_KEY };
}

export function getActiveKey(axiosApiCallActiveKey: any) {
  return function (dispatch: any, getState: any) {
    dispatch(beginApiCall());
    return axiosApiCallActiveKey(getState().token)
      .then((response: any) => {
        dispatch(endApiCall());
        dispatch(getActiveKeySuccess({ key: { ...response.data } } as Key));
      })
      .catch((error: any) => {
        dispatch(endApiCall());
        if (error.response && error.response.status === 401) {
          dispatch(refreshToken(getActiveKey(axiosApiCallActiveKey)));
        } else {
          throw error;
        }
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
        if (error.response && error.response.status === 401) {
          dispatch(refreshToken(postKey(axiosApiCallCreateKey, key)));
        } else {
          throw error;
        }
      });
  };
}

export function createKey(axiosApiCallActiveKey: any) {
  return function (dispatch: any) {
    dispatch(beginApiCall());
    return generateKey(true)
      .then((key: Key) => {
        dispatch(keyGenerated(key));
        dispatch(postKey(axiosApiCallActiveKey, key));
        dispatch(endApiCall());
      })
      .catch((error: any) => {
        dispatch(endApiCall());
        throw error;
      });
  };
}
