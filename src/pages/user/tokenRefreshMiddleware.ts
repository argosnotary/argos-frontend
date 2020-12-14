/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { Token, PersonalAccountApi } from "../../api";
import { getApiConfig } from "../../api/apiConfig";
import * as jwtdecode from "jwt-decode";
import jwt_decode from "jwt-decode";
import { logout, refreshTokenSuccess } from "./tokenSlice";
import { beginTokenRefreshing, endTokenRefreshing } from "./tokenRefreshSlice";

interface middlewareOpt {
  dispatch: any;
  getState: any;
}

function tokenRefreshMiddleware() {
  return ({ dispatch, getState }: middlewareOpt) => (next: any) => (action: any) => {
    if (typeof action === "function") {
      const state = getState();
      if (!state.refreshing) {
        if (state.token && shouldRefreshed(state.token)) {
          return refreshToken(dispatch, state).then(() => next(action));
        }
      }
    }
    return next(action);
  };
}

const refreshMiddleware = tokenRefreshMiddleware();

export default refreshMiddleware;

const REFRESH_INTERVAL_IN_SECONDS: number = 15 * 60;

function shouldRefreshed(token: Token) {
  const jwtToken: jwtdecode.JwtPayload = jwt_decode(token.token);
  const currentTime = new Date().getTime() / 1000;
  if (jwtToken && jwtToken.iat) {
    return currentTime > jwtToken.iat + REFRESH_INTERVAL_IN_SECONDS;
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
    .catch(() => {
      dispatch(endTokenRefreshing());
      dispatch(logout());
    });
}
