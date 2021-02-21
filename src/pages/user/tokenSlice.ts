import { Label } from "./../../api/api";
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
import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isDeleteLabelAction } from "../label/labelSlice";

export function isLogoutAction(action: AnyAction): boolean {
  return action.type === "token/logout/fulfilled" || action.type === "token/logout/rejected";
}
export const logout: any = createAsyncThunk("token/logout", async (_, thunkAPI: any) => {
  const api = new PersonalAccountApi(getApiConfig(thunkAPI.getState().token.token));
  try {
    const response = await api.logout();
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.message);
  }
});

const initialState = {} as Token;

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    login(state, action: PayloadAction<Token>) {
      return action.payload;
    },
    refreshTokenSuccess(state, action: PayloadAction<Token>) {
      return action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(logout.fulfilled, () => {
        return initialState;
      })
      .addMatcher(isLogoutAction, () => {
        return initialState;
      });
  }
});

export const { login, refreshTokenSuccess } = tokenSlice.actions;

export default tokenSlice.reducer;
