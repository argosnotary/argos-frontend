import React, { Dispatch } from "react";

import ITreeNode from "../interfaces/ITreeNode";
import IStringList from "../interfaces/IStringList";
import ITreeContextMenuEntry from "../interfaces/ITreeContextMenuEntry";

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

export type TreeReducerAction =
  | { type: "storedata"; data: Array<ITreeNode> }
  | { type: "updatetogglednodes"; id: string }
  | { type: "showcontextmenu"; id: string; clientX: number; clientY: number }
  | { type: "hidecontextmenu" };

export const TreeStateContext = React.createContext<
  [
    ITreeReducerState,
    Dispatch<TreeReducerAction>,
    IStringList,
    Array<ITreeContextMenuEntry>,
    () => void,
    (parentId: string) => void,
    boolean
  ]
>([
  {} as ITreeReducerState,
  () => {
    return;
  },
  {} as IStringList,
  [],
  () => {
    return;
  },
  () => {
    return;
  },
  false
]);

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
    case "hidecontextmenu":
      return {
        ...state,
        contextMenu: {
          id: "",
          show: false,
          x: 0,
          y: 0
        }
      };
    case "showcontextmenu":
      return {
        ...state,
        contextMenu: {
          id: action.id,
          show: true,
          x: action.clientX,
          y: action.clientY
        }
      };
    case "storedata":
      return {
        ...state,
        data: action.data
      };
    case "updatetogglednodes":
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
