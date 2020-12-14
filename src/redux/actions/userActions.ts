import { Token } from "../../api/api";
import {
  LOGIN,
  LOGOUT,
  LOAD_PROFILE_SUCCESS,
  REFRESH_TOKEN_SUCCESS,
  LoginAction,
  LoadProfileSuccessAction,
  LogoutAction,
  RefreshTokenSuccessAction
} from "./actionTypes";
import { PersonalAccountApi, Profile } from "../../api/api";
import { getApiConfig } from "../../api/apiConfig";
import { beginApiCall, endApiCall } from "./apiStatusActions";

export function login(token: Token): LoginAction {
  return { type: LOGIN, token };
}

export function logout(): LogoutAction {
  return { type: LOGOUT };
}

export function loadProfileSuccess(profile: Profile): LoadProfileSuccessAction {
  return { type: LOAD_PROFILE_SUCCESS, profile };
}

export function refreshTokenSuccess(token: Token): RefreshTokenSuccessAction {
  return { type: REFRESH_TOKEN_SUCCESS, token };
}

export function loadProfile() {
  return function (dispatch: any, getState: any) {
    const api = new PersonalAccountApi(getApiConfig(getState().token.token));
    dispatch(beginApiCall());
    return api
      .getPersonalAccountOfAuthenticatedUser()
      .then(response => {
        dispatch(loadProfileSuccess(response.data));
        dispatch(endApiCall());
      })
      .catch(error => {
        dispatch(endApiCall());
        if (error.response && error.response.status === 401) {
          dispatch(refreshToken(loadProfile()));
        } else {
          throw error;
        }
      });
  };
}

export function logoutOnServer() {
  return function (dispatch: any, getState: any) {
    const api = new PersonalAccountApi(getApiConfig(getState().token.token));
    return api
      .logout()
      .then(response => {
        dispatch(logout());
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          dispatch(refreshToken(logoutOnServer()));
        } else {
          throw error;
        }
      });
  };
}

export function refreshToken(caller: any) {
  return function (dispatch: any, getState: any) {
    const api = new PersonalAccountApi(getApiConfig(getState().token.token));
    dispatch(beginApiCall());
    return api
      .refreshToken()
      .then(response => {
        dispatch(refreshTokenSuccess(response.data));
        dispatch(caller);
      })
      .catch(error => {
        dispatch(endApiCall());
        dispatch(logout());
        throw error;
      });
  };
}
