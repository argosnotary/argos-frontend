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
import { Label, LocalPermissions, Permission, TreeNodeTypeEnum } from "./../../api/api";
import { isLogoutAction } from "../user/tokenSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiConfig } from "../../api/apiConfig";
import { PersonalAccount, PersonalAccountApi } from "../../api";
import { isSetCurrentNodeAction } from "../explorer/treeSlice";

export interface AccountWithPermissions {
  account: PersonalAccount;
  localPermissions: LocalPermissions;
}

export const getUsersWithPermissions: any = createAsyncThunk(
  "label/getUsersWithPermissions",
  async (label: Label, thunkAPI: any) => {
    const api = new PersonalAccountApi(getApiConfig(thunkAPI.getState().token.token));
    try {
      if (label.id) {
        const response = await api.searchPersonalAccounts(label.id);
        const accounts: PersonalAccount[] = response.data;
        const usersWithPermissions: AccountWithPermissions[] = [];
        for (const account of accounts) {
          const accountResponse = account.id ? await api.getLocalPermissionsForLabel(account.id, label.id) : null;
          if (accountResponse) {
            usersWithPermissions.push({
              account: account,
              localPermissions: {
                labelId: label.id,
                permissions: [...(accountResponse.data.permissions as Permission[])]
              } as LocalPermissions
            });
          }
        }
        return usersWithPermissions;
      } else {
        return [] as AccountWithPermissions[];
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.message);
    }
  }
);

export const updateUserPermissions: any = createAsyncThunk(
  "localPermissions/updateUserPermissions",
  async (user: AccountWithPermissions, thunkAPI: any) => {
    const api = new PersonalAccountApi(getApiConfig(thunkAPI.getState().token.token));
    try {
      if (user.account.id) {
        await api.updateLocalPermissionsForLabel(
          user.account.id,
          user.localPermissions.labelId,
          user.localPermissions.permissions
        );
        return user;
      } else {
        return {} as AccountWithPermissions;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.message);
    }
  }
);

export interface LocalPermissionsState {
  usersWithPermissions: AccountWithPermissions[];
}

const initialState = {
  usersWithPermissions: [] as AccountWithPermissions[]
} as LocalPermissionsState;

const localPermissionsSlice = createSlice({
  name: "localPermissions",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUsersWithPermissions.fulfilled, (state, action) => {
        return { ...state, usersWithPermissions: action.payload };
      })
      .addCase(updateUserPermissions.fulfilled, (state, action) => {
        return {
          ...state,
          usersWithPermissions: [
            ...state.usersWithPermissions.filter(
              user => user.account.id && user.account.id !== action.payload.account.id
            ),
            action.payload
          ].filter(
            user =>
              user.localPermissions && user.localPermissions.permissions && user.localPermissions.permissions.length > 0
          )
        };
      })
      .addMatcher(isLogoutAction, () => {
        return initialState;
      })
      .addMatcher(isSetCurrentNodeAction, (state, action) => {
        if (action.payload.type == TreeNodeTypeEnum.LABEL) {
          if (
            state.usersWithPermissions.length > 0 &&
            state.usersWithPermissions[0].localPermissions.labelId === action.payload.referenceId
          ) {
            return state;
          }
          return initialState;
        } else {
          return state;
        }
      });
  }
});

export default localPermissionsSlice.reducer;
