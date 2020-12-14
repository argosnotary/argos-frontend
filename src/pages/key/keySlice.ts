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
import { ServiceAccountKeyPair, KeyPair, PersonalAccountApi } from "./../../api/api";
import { generateKey } from "../../util/security";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isLogoutAction } from "../user/tokenSlice";
import { getApiConfig } from "../../api/apiConfig";

export enum KeyType {
  PERSONALACCOUNT_KEY_TYPE
}

export interface KeyState {
  key?: ServiceAccountKeyPair;
  password?: string;
}

const initialState = {} as KeyState;

export const getActiveKey: any = createAsyncThunk("key/getActiveKey", async (keyType: KeyType, thunkAPI: any) => {
  try {
    if (keyType === KeyType.PERSONALACCOUNT_KEY_TYPE) {
      const api = new PersonalAccountApi(getApiConfig(thunkAPI.getState().token.token));
      const response = await api.getKeyPair();
      return { key: { ...response.data } };
    }
  } catch (error: any) {
    if (error.response && error.response.status !== 404) {
      return thunkAPI.rejectWithValue(error.response.message);
    } else {
      return initialState;
    }
  }
});

export const createKey: any = createAsyncThunk("key/createKey", async (keyType: KeyType, thunkAPI: any) => {
  try {
    const key = await generateKey(true);
    if (keyType === KeyType.PERSONALACCOUNT_KEY_TYPE) {
      const api = new PersonalAccountApi(getApiConfig(thunkAPI.getState().token.token));
      await api.createKey({
        keyId: key.key.keyId,
        publicKey: key.key.publicKey,
        encryptedPrivateKey: key.key.encryptedPrivateKey
      } as KeyPair);
    }
    return key;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error);
  }
});

const keySlice = createSlice({
  name: "key",
  initialState,
  reducers: {
    removePasswordFromKey(state) {
      return { ...state, password: undefined };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getActiveKey.fulfilled, (state, action) => {
        if (action.payload) {
          return action.payload;
        } else {
          return initialState;
        }
      })
      .addCase(createKey.fulfilled, (state, action) => {
        return action.payload;
      })
      .addMatcher(isLogoutAction, () => {
        return initialState;
      });
  }
});

export const { removePasswordFromKey } = keySlice.actions;

export default keySlice.reducer;
