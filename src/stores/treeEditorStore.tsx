/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
import IStringList from "../interfaces/IStringList";
import ITreeContextMenuEntry from "../interfaces/ITreeContextMenuEntry";
import ITreeClickHandler from "../interfaces/ITreeClickHandler";

export interface ITreeReducerState {
  toggledNodes: Array<string>;
  data: Array<ITreeNode>;
  contextMenu: {
    id: string;
    show: boolean;
    x: number;
    y: number;
  };
}

export enum TreeReducerActionTypes {
  STOREDATA = "storedata",
  UPDATETOGGLEDNODES = "updatetogglednodes",
  SHOWCONTEXTMENU = "showcontextmenu",
  HIDECONTEXTMENU = "hidecontextmenu"
}

export type TreeReducerAction =
  | { type: TreeReducerActionTypes.STOREDATA; data: Array<ITreeNode> }
  | { type: TreeReducerActionTypes.UPDATETOGGLEDNODES; id: string }
  | {
      type: TreeReducerActionTypes.SHOWCONTEXTMENU;
      id: string;
      clientX: number;
      clientY: number;
    }
  | { type: TreeReducerActionTypes.HIDECONTEXTMENU };

export interface ITreeStateContext {
  treeState: ITreeReducerState;
  treeDispatch: Dispatch<TreeReducerAction>;
  treeStringList: IStringList;
  treeContextMenu: Array<ITreeContextMenuEntry>;
  treeClickHandlers: Array<ITreeClickHandler>;
  cbCreateRootNode: () => void;
  canCreateRootNode: () => boolean;
  cbGetNodeChildren: (parentId: string) => void;
  isLoading: boolean;
  selectedNodeReferenceId: string;
}

export const TreeStateContext = React.createContext<ITreeStateContext>(
  {} as ITreeStateContext
);

export const initialTreeState: ITreeReducerState = {
  toggledNodes: [],
  data: [],
  contextMenu: {
    id: "",
    show: false,
    x: 0,
    y: 0
  }
};

export const treeReducer = (
  state: ITreeReducerState,
  action: TreeReducerAction
) => {
  switch (action.type) {
    case TreeReducerActionTypes.HIDECONTEXTMENU:
      return {
        ...state,
        contextMenu: {
          id: "",
          show: false,
          x: 0,
          y: 0
        }
      };
    case TreeReducerActionTypes.SHOWCONTEXTMENU:
      return {
        ...state,
        contextMenu: {
          id: action.id,
          show: true,
          x: action.clientX,
          y: action.clientY
        }
      };
    case TreeReducerActionTypes.STOREDATA:
      return {
        ...state,
        data: action.data
      };
    case TreeReducerActionTypes.UPDATETOGGLEDNODES:
      if (state.toggledNodes.find(node => node === action.id)) {
        return {
          ...state,
          toggledNodes: state.toggledNodes.filter(node => node !== action.id)
        };
      }

      return {
        ...state,
        toggledNodes: [...state.toggledNodes, action.id]
      };
  }
};
