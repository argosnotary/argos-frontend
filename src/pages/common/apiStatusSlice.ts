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
import { isLogoutAction } from "../user/tokenSlice";
import { Action, AnyAction, createSlice } from "@reduxjs/toolkit";

const initialState = 0;

interface BeginAsyncCallAction extends Action {
  callsInProgress: number;
}

function beginsAsyncCallAction(action: AnyAction): action is BeginAsyncCallAction {
  return action.type.endsWith("/pending");
}

function endsAsyncCallAction(action: AnyAction): boolean {
  return action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected");
}
const apiCallSlice = createSlice({
  name: "apiCallStatus",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(isLogoutAction, () => {
        return initialState;
      })
      .addMatcher(beginsAsyncCallAction, state => {
        const ff = state++;
        return ff;
      })
      .addMatcher(endsAsyncCallAction, state => {
        return state--;
      });
  }
});

export default apiCallSlice.reducer;
