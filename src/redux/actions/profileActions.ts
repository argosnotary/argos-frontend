import { Token, PersonalAccountApi, Role, Profile } from "../../api";
import { getApiConfig } from "../../api/apiConfig";
import { beginApiCall, endApiCall } from "./apiStatusActions";

export const LOAD_PROFILE_SUCCESS = "LOAD_PROFILE_SUCCESS";

export interface LoadProfileSuccessAction {
  type: typeof LOAD_PROFILE_SUCCESS;
  profile: Profile;
}

export interface ProfileState {
  profile?: Profile;
}

export type ProfileActionTypes = LoadProfileSuccessAction;

export function loadProfileSuccess(profile: Profile): LoadProfileSuccessAction {
  return { type: LOAD_PROFILE_SUCCESS, profile };
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
        throw error;
      });
  };
}
