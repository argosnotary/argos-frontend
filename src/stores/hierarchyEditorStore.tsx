/*
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { Dispatch } from "react";

import ITreeNode from "../interfaces/ITreeNode";
import { FormPermission } from "../types/FormPermission";
import { ITreeReducerState, TreeReducerAction } from "./treeEditorStore";

export enum HierarchyEditorPanelTypes {
  NONE = "",
  LABEL = "LABEL",
  SUPPLY_CHAIN = "SUPPLY_CHAIN",
  SERVICE_ACCOUNT = "SERVICE_ACCOUNT",
  SERVICE_ACCOUNT_KEY_GENERATOR = "SERVICE_ACCOUNT_KEY_GENERATOR",
  MANAGE_LABEL_PERMISSIONS = "MANAGE_LABEL_PERMISSIONS",
  MANAGE_LAYOUT = "MANAGE_LAYOUT",
  EXECUTE_APPROVAL = "EXECUTE_APPROVAL",
  EXECUTE_RELEASE = "EXECUTE_RELEASE"
}

export enum HierarchyEditorPanelModes {
  DEFAULT = "DEFAULT",
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export interface IHierarchyEditorState {
  node: ITreeNode;
  breadcrumb: string;
  mode: HierarchyEditorPanelModes;
  panel: HierarchyEditorPanelTypes;
  permission: FormPermission;
}

export enum HierarchyEditorActionTypes {
  RESET = "RESET",
  SET_PANEL = "SET_PANEL",
  UPDATE_NODE = "UPDATE_NODE",
  UPDATE_PANEL_MODE = "UPDATE_PANEL_MODE"
}

export type HierarchyEditorActions =
  | HierarchyEditorActionTypes.SET_PANEL
  | HierarchyEditorActionTypes.RESET
  | HierarchyEditorActionTypes.UPDATE_NODE
  | HierarchyEditorActionTypes.UPDATE_PANEL_MODE;

export type HierarchyEditorAction =
  | {
      type: HierarchyEditorActionTypes.SET_PANEL;
      node: ITreeNode;
      panel: HierarchyEditorPanelTypes;
      mode: HierarchyEditorPanelModes;
      breadcrumb: string;
      permission: FormPermission;
    }
  | { type: HierarchyEditorActionTypes.RESET }
  | { type: HierarchyEditorActionTypes.UPDATE_NODE; node: ITreeNode }
  | {
      type: HierarchyEditorActionTypes.UPDATE_PANEL_MODE;
      mode: HierarchyEditorPanelModes;
    };
const hierarchyEditorReducer = (
  state: IHierarchyEditorState,
  action: HierarchyEditorAction
) => {
  switch (action.type) {
    case HierarchyEditorActionTypes.SET_PANEL:
      return {
        ...state,
        node: action.node,
        mode: action.mode,
        breadcrumb: action.breadcrumb,
        panel: action.panel,
        permission: action.permission
      };
    case HierarchyEditorActionTypes.RESET:
      return {
        ...state,
        panel: HierarchyEditorPanelTypes.NONE
      };
    case HierarchyEditorActionTypes.UPDATE_NODE:
      return {
        ...state,
        node: action.node
      };
    case HierarchyEditorActionTypes.UPDATE_PANEL_MODE:
      return {
        ...state,
        mode: action.mode
      };
  }
};

export interface IHierarchyEditorStateContextState {
  editor: IHierarchyEditorState;
  tree: ITreeReducerState;
}

export interface IHierarchyEditorStateContextDispatch {
  editor: Dispatch<HierarchyEditorAction>;
  tree: Dispatch<TreeReducerAction>;
}

const HierarchyEditorStateContext = React.createContext<
  [IHierarchyEditorStateContextState, IHierarchyEditorStateContextDispatch]
>([
  {
    tree: {} as ITreeReducerState,
    editor: {} as IHierarchyEditorState
  },
  {
    tree: () => {
      return;
    },
    editor: () => {
      return;
    }
  }
]);

export { hierarchyEditorReducer, HierarchyEditorStateContext };
