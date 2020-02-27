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
import ILabelPostResponse from "../interfaces/ILabelPostResponse";
import ISupplyChainApiResponse from "../interfaces/ISupplyChainApiResponse";

interface ILayoutEditorState {
  nodeParentId: string;
  nodeReferenceId: string;
  firstPanelView: string;
  breadcrumb: string;
  selectedNodeName: string;
  data?: any;
  dataAction?: string;
}

export enum LayoutEditorDataActionTypes {
  NONE = "",
  POST_NEW_LABEL = "POST_NEW_LABEL",
  PUT_LABEL = "PUT_LABEL",
  POST_SUPPLY_CHAIN = "POST_SUPPLY_CHAIN",
  PUT_SUPPLY_CHAIN = "PUT_SUPPLY_CHAIN"
}

export enum LayoutEditorPaneActionTypes {
  NONE = "",
  SHOW_ADD_LABEL_PANE = "SHOW_ADD_LABEL_PANE",
  SHOW_UPDATE_LABEL_PANE = "SHOW_UPDATE_LABEL_PANE",
  SHOW_ADD_SUPPLY_CHAIN_PANE = "SHOW_ADD_SUPPLY_CHAIN_PANE",
  SHOW_UPDATE_SUPPLY_CHAIN_PANE = "SHOW_UPDATE_SUPPLY_CHAIN_PANE",
  RESET_PANE = "RESET_PANE"
}

export type LayoutEditorPaneActionType =
  | LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE
  | LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE
  | LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE
  | LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE
  | LayoutEditorPaneActionTypes.RESET_PANE;

export type LayoutEditorPaneAction =
  | {
      type: LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE;
      nodeParentId: string;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | {
      type: LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | {
      type: LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
      nodeParentId: string;
    }
  | {
      type: LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | { type: LayoutEditorPaneActionTypes.RESET_PANE };

export type LayoutEditorDataAction =
  | {
      type: LayoutEditorDataActionTypes.POST_NEW_LABEL;
      label: ILabelPostResponse;
    }
  | { type: LayoutEditorDataActionTypes.PUT_LABEL; label: ILabelPostResponse }
  | {
      type: LayoutEditorDataActionTypes.POST_SUPPLY_CHAIN;
      supplyChain: ISupplyChainApiResponse;
    }
  | {
      type: LayoutEditorDataActionTypes.PUT_SUPPLY_CHAIN;
      supplyChain: ISupplyChainApiResponse;
    };

type LayoutEditorAction = LayoutEditorPaneAction | LayoutEditorDataAction;

const editorReducer = (
  state: ILayoutEditorState,
  action: LayoutEditorAction
) => {
  switch (action.type) {
    case LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE:
      return {
        ...state,
        firstPanelView: LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE,
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE:
      return {
        ...state,
        firstPanelView: LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE:
      return {
        ...state,
        firstPanelView: LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE,
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE:
      return {
        ...state,
        firstPanelView:
          LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case LayoutEditorPaneActionTypes.RESET_PANE:
      return {
        ...state,
        firstPanelView: "",
        nodeReferenceId: "",
        dataAction: ""
      };
    case LayoutEditorDataActionTypes.POST_NEW_LABEL:
      return {
        ...state,
        dataAction: LayoutEditorDataActionTypes.POST_NEW_LABEL,
        data: action.label
      };
    case LayoutEditorDataActionTypes.PUT_LABEL: {
      return {
        ...state,
        dataAction: LayoutEditorDataActionTypes.PUT_LABEL,
        data: action.label
      };
    }
    case LayoutEditorDataActionTypes.POST_SUPPLY_CHAIN:
      return {
        ...state,
        dataAction: LayoutEditorDataActionTypes.POST_SUPPLY_CHAIN,
        data: action.supplyChain
      };
    case LayoutEditorDataActionTypes.PUT_SUPPLY_CHAIN:
      return {
        ...state,
        dataAction: LayoutEditorDataActionTypes.PUT_SUPPLY_CHAIN,
        data: action.supplyChain
      };
  }
};

const StateContext = React.createContext<
  [ILayoutEditorState, Dispatch<LayoutEditorAction>]
>([
  {} as ILayoutEditorState,
  () => {
    return;
  }
]);

export { editorReducer, StateContext };
