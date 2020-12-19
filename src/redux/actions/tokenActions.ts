import { Token, PersonalAccountApi, Role, Profile } from "../../api";
import { getApiConfig } from "../../api/apiConfig";
import { beginApiCall, endApiCall } from "./apiStatusActions";
import * as jwtdecode from "jwt-decode";
import jwt_decode from "jwt-decode";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const LOAD_PROFILE_SUCCESS = "LOAD_PROFILE_SUCCESS";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";

interface TokenState {
  token: Token;
}

export interface LoginAction {
  type: typeof LOGIN;
  token: Token;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface RefreshTokenSuccessAction {
  type: typeof REFRESH_TOKEN_SUCCESS;
  token: Token;
}

export function login(token: Token): LoginAction {
  return { type: LOGIN, token };
}

export function logout(): LogoutAction {
  return { type: LOGOUT };
}

export function refreshTokenSuccess(token: Token): RefreshTokenSuccessAction {
  return { type: REFRESH_TOKEN_SUCCESS, token };
}

export type TokenActionTypes = LoginAction | LogoutAction | RefreshTokenSuccessAction;

export function logoutOnServer() {
  return function (dispatch: any, getState: any) {
    const api = new PersonalAccountApi(getApiConfig(getState().token.token));
    return api
      .logout()
      .then(response => {
        dispatch(logout());
      })
      .catch(error => {
        throw error;
      });
  };
}
