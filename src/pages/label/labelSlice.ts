import { AnyAction } from "@reduxjs/toolkit";
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
import { getApiConfig } from "../../api/apiConfig";
import { Label, TreeNode, HierarchyApi, TreeNodeTypeEnum } from "../../api/api";
import { getNode, isSetCurrentNodeAction } from "../explorer/treeSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isLogoutAction } from "../user/tokenSlice";

export const createLabel: any = createAsyncThunk("label/createLabel", async (label: Label, thunkAPI: any) => {
  const api = new HierarchyApi(getApiConfig(thunkAPI.getState().token.token));
  try {
    const response = await api.createLabel(label);
    const newLabel = response.data as Label;
    thunkAPI.dispatch(getNode({ referenceId: newLabel.id } as TreeNode));
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.message);
  }
});

export const updateLabel: any = createAsyncThunk("label/updateLabel", async (label: Label, thunkAPI: any) => {
  const api = new HierarchyApi(getApiConfig(thunkAPI.getState().token.token));
  try {
    const response = await api.updateLabelById(label.id || "", label);
    const newLabel = response.data as Label;
    thunkAPI.dispatch(getNode({ referenceId: newLabel.id } as TreeNode));
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.message);
  }
});

export const deleteLabel: any = createAsyncThunk("label/deleteLabel", async (label: Label, thunkAPI: any) => {
  const api = new HierarchyApi(getApiConfig(thunkAPI.getState().token.token));
  try {
    await api.deleteLabelById(label.id || "", label);
    return label;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.message);
  }
});

export function isDeleteLabelAction(action: AnyAction): boolean {
  return action.type === "label/deleteLabel/fulfilled";
}

const initialState = {} as Label;

const labelSlice = createSlice({
  name: "label",
  initialState,
  reducers: {
    setLabel(state, action) {
      return action.payload;
    },
    clearLabel() {
      return initialState;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createLabel.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(updateLabel.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(deleteLabel.fulfilled, (state, action) => {
        return initialState;
      })
      .addMatcher(isSetCurrentNodeAction, (state, action) => {
        if (action.payload.type == TreeNodeTypeEnum.LABEL) {
          state.id = action.payload.referenceId;
          state.parentLabelId = action.payload.parentLabelId;
          state.name = action.payload.name ? action.payload.name : "";
          return state;
        } else {
          return state;
        }
      })
      .addMatcher(isLogoutAction, () => {
        return initialState;
      });
  }
});

export const { clearLabel, setLabel } = labelSlice.actions;

export default labelSlice.reducer;
