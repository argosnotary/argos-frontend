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
import { isLogoutAction } from "./../user/tokenSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiConfig } from "../../api/apiConfig";
import { PersonalAccount, PersonalAccountApi } from "../../api";

export const searchUsers: any = createAsyncThunk("role/searchUsers", async (namePart: string, thunkAPI: any) => {
  const api = new PersonalAccountApi(getApiConfig(thunkAPI.getState().token.token));
  try {
    const response = await api.searchPersonalAccountsWithRoles(undefined, namePart);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.message);
  }
});

const initialState = {
  searchedUsers: [] as PersonalAccount[]
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearSearchedUsers(state) {
      state.searchedUsers = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(searchUsers.fulfilled, (state, action) => {
        return { ...state, searchedUsers: action.payload };
      })
      .addMatcher(isLogoutAction, () => {
        return initialState;
      });
  }
});

export const { clearSearchedUsers } = roleSlice.actions;

export default roleSlice.reducer;
