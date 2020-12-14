import { Key } from "./../../util/security/index";
import { Token } from "../../api/api";
import { Profile } from "../../api";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const REFRESH = "REFRESH";
export const LOAD_PROFILE_SUCCESS = "LOAD_PROFILE_SUCCESS";
export const REFRESH_TOKEN_SUCCESS = "REFRESH_TOKEN_SUCCESS";
export const BEGIN_API_CALL = "BEGIN_API_CALL";
export const END_API_CALL = "END_API_CALL";
export const API_CALL_ERROR = "API_CALL_ERROR";
export const GET_ACTIVE_KEY_SUCCESS = "GET_ACTIVE_KEY_SUCCESS";
export const KEY_GENERATED = "KEY_GENERATED";
export const CREATE_KEY_SUCCESS = "CREATE_KEY_SUCCESS";
export const REMOVE_PASSWORD_FROM_KEY = "REMOVE_PASSWORD_FROM_KEY";

export interface LoginAction {
  type: typeof LOGIN;
  token: Token;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export interface RefreshAction {
  type: typeof REFRESH;
}

export interface LoadProfileSuccessAction {
  type: typeof LOAD_PROFILE_SUCCESS;
  profile: Profile;
}

export interface RefreshTokenSuccessAction {
  type: typeof REFRESH_TOKEN_SUCCESS;
  token: Token;
}

export interface GetActiveKeySuccessAction {
  type: typeof GET_ACTIVE_KEY_SUCCESS;
  key: Key;
}

export interface PostKeySuccessAction {
  type: typeof CREATE_KEY_SUCCESS;
}

export interface KeyGeneratedAction {
  type: typeof KEY_GENERATED;
  key: Key;
}

export interface RemovePasswordFromKeyAction {
  type: typeof REMOVE_PASSWORD_FROM_KEY;
}

export interface ProfileState {
  profile?: Profile;
}

export interface KeyState {
  keyId?: string;
  publicKey?: string;
  encryptedPrivateKey?: string;
}

export type ActionTypes =
  | LoginAction
  | LogoutAction
  | RefreshAction
  | LoadProfileSuccessAction
  | RefreshTokenSuccessAction
  | GetActiveKeySuccessAction
  | PostKeySuccessAction
  | KeyGeneratedAction
  | RemovePasswordFromKeyAction;
