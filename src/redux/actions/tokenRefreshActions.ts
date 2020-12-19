import { Token, PersonalAccountApi } from "../../api";
import { getApiConfig } from "../../api/apiConfig";
import * as jwtdecode from "jwt-decode";
import jwt_decode from "jwt-decode";
import { logout, refreshTokenSuccess } from "./tokenActions";

export const BEGIN_TOKEN_REFRESHING = "BEGIN_TOKEN_REFRESHING";
export const END_TOKEN_REFRESHING = "END_TOKEN_REFRESHING";

export interface BeginTokenRefreshingAction {
  type: typeof BEGIN_TOKEN_REFRESHING;
}

export interface EndTokenRefreshingAction {
  type: typeof END_TOKEN_REFRESHING;
}

export function beginTokenRefreshing(): BeginTokenRefreshingAction {
  return { type: BEGIN_TOKEN_REFRESHING };
}

export function endTokenRefreshing(): EndTokenRefreshingAction {
  return { type: END_TOKEN_REFRESHING };
}

export type TokenRefreshActionTypes = BeginTokenRefreshingAction | EndTokenRefreshingAction;

interface middlewareOpt {
  dispatch: any;
  getState: any;
}

function tokenRefreshMiddleware() {
  return ({ dispatch, getState }: middlewareOpt) => (next: any) => (action: any) => {
    if (typeof action === "function") {
      const state = getState();
      if (!state.refreshing) {
        if (state.token && isExpired(state.token)) {
          return refreshToken(dispatch, state).then(() => next(action));
        }
      }
    }
    return next(action);
  };
}

const refreshMiddleware = tokenRefreshMiddleware();

export default refreshMiddleware;

function isExpired(token: Token) {
  const jwtToken: jwtdecode.JwtPayload = jwt_decode(token.token);
  const currentTime = new Date().getTime() / 1000;
  if (jwtToken && jwtToken.exp) {
    return currentTime > jwtToken.exp - 60;
  } else {
    return true;
  }
}

function refreshToken(dispatch: any, state: any) {
  dispatch(beginTokenRefreshing());
  const api = new PersonalAccountApi(getApiConfig(state.token.token));
  return api
    .refreshToken()
    .then(response => {
      dispatch(refreshTokenSuccess(response.data));
      dispatch(endTokenRefreshing());
    })
    .catch(error => {
      dispatch(logout());
      dispatch(endTokenRefreshing());
      throw error;
    });
}
