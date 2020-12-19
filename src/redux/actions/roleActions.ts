import axios from "axios";
import { getApiConfig } from "../../api/apiConfig";
import { PermissionsApi, Role, PersonalAccount, PersonalAccountApi, Token } from "./../../api";

export const GET_ALL_ROLES_SUCCESS = "GET_ALL_ROLES_SUCCESS";
export const SEARCH_ADMINISTRATORS_SUCCESS = "SEARCH_ADMINISTRATORS_SUCCESS";
export const SEARCH_ACCOUNTS_SUCCESS = "SEARCH_ACCOUNTS_SUCCESS";
export const GET_PERSONAL_ACCOUNT_BY_ID_SUCCESS = "GET_PERSONAL_ACCOUNT_BY_ID_SUCCESS";
export const UPDATE_USER_ROLES_SUCCESS = "UPDATE_USER_ROLES_SUCCESS";
export const CANCEL_SELECTING_USER = "CANCEL_SELECTING_USER";

export interface getAllRolesSuccessAction {
  type: typeof GET_ALL_ROLES_SUCCESS;
  roles: Role[];
}

export interface searchAdministratorsSuccessAction {
  type: typeof SEARCH_ADMINISTRATORS_SUCCESS;
  administrators: PersonalAccount[];
}

export interface searchAccountsSuccessAction {
  type: typeof SEARCH_ACCOUNTS_SUCCESS;
  users: PersonalAccount[];
}

export interface getPersonalAccountByIdSuccessAction {
  type: typeof GET_PERSONAL_ACCOUNT_BY_ID_SUCCESS;
  selectedUser: PersonalAccount;
}

export interface updateUserRolesSuccessAction {
  type: typeof UPDATE_USER_ROLES_SUCCESS;
  selectedUser: PersonalAccount;
}

export interface cancelSelectingUserAction {
  type: typeof CANCEL_SELECTING_USER;
}

export type RoleActionTypes =
  | getAllRolesSuccessAction
  | searchAdministratorsSuccessAction
  | searchAccountsSuccessAction
  | getPersonalAccountByIdSuccessAction
  | updateUserRolesSuccessAction
  | cancelSelectingUserAction;

export function getAllRolesSuccessActionSuccess(roles: Role[]): getAllRolesSuccessAction {
  return { type: GET_ALL_ROLES_SUCCESS, roles };
}
export function searchAdministratorsSuccessActionSuccess(
  administrators: PersonalAccount[]
): searchAdministratorsSuccessAction {
  return { type: SEARCH_ADMINISTRATORS_SUCCESS, administrators };
}
export function searchAccountsSuccessActionSuccess(users: PersonalAccount[]): searchAccountsSuccessAction {
  return { type: SEARCH_ACCOUNTS_SUCCESS, users };
}

export function getPersonalAccountByIdSuccessActionSuccess(
  selectedUser: PersonalAccount
): getPersonalAccountByIdSuccessAction {
  return { type: GET_PERSONAL_ACCOUNT_BY_ID_SUCCESS, selectedUser };
}

export function updateUserRolesSuccessActionSuccess(selectedUser: PersonalAccount): updateUserRolesSuccessAction {
  return { type: UPDATE_USER_ROLES_SUCCESS, selectedUser };
}

export function cancelSelectingUser(): cancelSelectingUserAction {
  return { type: CANCEL_SELECTING_USER };
}

export function getAllRoles() {
  return function (dispatch: any, getState: any) {
    const api = new PermissionsApi(getApiConfig(getState().token.token));
    api
      .getRoles()
      .then(response => {
        dispatch(getAllRolesSuccessActionSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function searchAdministrators() {
  return function (dispatch: any, getState: any) {
    const api = new PersonalAccountApi(getApiConfig(getState().token.token));
    api
      .searchPersonalAccounts("administrator")
      .then(response => {
        dispatch(searchAdministratorsSuccessActionSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function searchAccounts(namePart: string) {
  return function (dispatch: any, getState: any) {
    const api = new PersonalAccountApi(getApiConfig(getState().token.token));
    const state = getState();
    api
      .searchPersonalAccounts(undefined, undefined, namePart)
      .then(response => {
        dispatch(searchAccountsSuccessActionSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function getPersonalAccountById(id: string) {
  return function (dispatch: any, getState: any) {
    const api = new PersonalAccountApi(getApiConfig(getState().token.token));
    api
      .getPersonalAccountById(id)
      .then(response => {
        dispatch(getPersonalAccountByIdSuccessActionSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function updateUserRoles(id: string, roles: string[]) {
  return function (dispatch: any, getState: any) {
    const api = new PersonalAccountApi(getApiConfig(getState().token.token));
    api
      .updatePersonalAccountRolesById(id, roles)
      .then(response => {
        dispatch(updateUserRolesSuccessActionSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}
