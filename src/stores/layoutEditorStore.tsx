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
import INpaApiResponse from "../interfaces/INpaApiResponse";
import { FormPermission } from "../types/FormPermission";

interface ILayoutEditorState {
  panePermission: FormPermission;
  nodeParentId: string;
  nodeReferenceId: string;
  firstPanelView: string;
  breadcrumb: string;
  selectedNodeName: string;
  data?: any;
  dataAction?: string;
  user?: any;
}

export enum LayoutEditorDataActionTypes {
  NONE = "",
  POST_NEW_LABEL = "POST_NEW_LABEL",
  PUT_LABEL = "PUT_LABEL",
  POST_SUPPLY_CHAIN = "POST_SUPPLY_CHAIN",
  PUT_SUPPLY_CHAIN = "PUT_SUPPLY_CHAIN",
  POST_NEW_NPA = "POST_NEW_NPA",
  POST_NEW_NPA_KEY = "POST_NEW_NPA_KEY",
  PUT_NPA = "PUT_NPA",
  DATA_ACTION_COMPLETED = "DATA_ACTION_COMPLETED",
  STORE_SEARCHED_USER = "STORE_SEARCHED_USER",
  REMOVE_SEARCHED_USER = "DELETE_SEARCHED_USER"
}

export enum LayoutEditorPaneActionTypes {
  NONE = "",
  SHOW_ADD_LABEL_PANE = "SHOW_ADD_LABEL_PANE",
  SHOW_UPDATE_LABEL_PANE = "SHOW_UPDATE_LABEL_PANE",
  SHOW_MANAGE_LABEL_PERMISSIONS = "SHOW_MANAGE_LABEL_PERMISSIONS",
  SHOW_ADD_SUPPLY_CHAIN_PANE = "SHOW_ADD_SUPPLY_CHAIN_PANE",
  SHOW_UPDATE_SUPPLY_CHAIN_PANE = "SHOW_UPDATE_SUPPLY_CHAIN_PANE",
  SHOW_ADD_NPA_PANE = "SHOW_ADD_NPA_PANE",
  SHOW_UPDATE_NPA_PANE = "SHOW_UPDATE_NPA_PANE",
  SHOW_NPA_PASSPHRASE = "SHOW_NPA_PASSPHRASE",
  SHOW_UPDATE_NPA_KEY_MODAL = "SHOW_UPDATE_NPA_KEY_MODAL",
  RESET_PANE = "RESET_PANE"
}

export type LayoutEditorPaneActionType =
  | LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE
  | LayoutEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS
  | LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE
  | LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE
  | LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE
  | LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE
  | LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE
  | LayoutEditorPaneActionTypes.SHOW_NPA_PASSPHRASE
  | LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL
  | LayoutEditorPaneActionTypes.RESET_PANE;

export type LayoutEditorPaneAction =
  | {
      type: LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE;
      nodeParentId: string;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
      panePermission: FormPermission;
    }
  | {
      type: LayoutEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS;
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
      panePermission: FormPermission;
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
      panePermission: FormPermission;
    }
  | {
      type: LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
      nodeParentId: string;
    }
  | {
      type: LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
      panePermission: FormPermission;
    }
  | { type: LayoutEditorPaneActionTypes.SHOW_NPA_PASSPHRASE }
  | {
      type: LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | { type: LayoutEditorPaneActionTypes.RESET_PANE };

interface IDataActionCompleted {
  type: LayoutEditorDataActionTypes.DATA_ACTION_COMPLETED;
  data: any;
}

interface IStoredSearchedUser {
  id: string;
  name: string;
}

export type LayoutEditorDataAction =
  | IDataActionCompleted
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
    }
  | {
      type: LayoutEditorDataActionTypes.POST_NEW_NPA;
      npa: INpaApiResponse;
    }
  | {
      type: LayoutEditorDataActionTypes.POST_NEW_NPA_KEY;
    }
  | {
      type: LayoutEditorDataActionTypes.PUT_NPA;
      npa: INpaApiResponse;
    }
  | {
      type: LayoutEditorDataActionTypes.STORE_SEARCHED_USER;
      user: IStoredSearchedUser;
    }
  | {
      type: LayoutEditorDataActionTypes.REMOVE_SEARCHED_USER;
    };

export type LayoutEditorAction =
  | LayoutEditorPaneAction
  | LayoutEditorDataAction;

const layoutEditorReducer = (
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
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case LayoutEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS:
      return {
        ...state,
        firstPanelView:
          LayoutEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS,
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
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
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
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE:
      return {
        ...state,
        firstPanelView: LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE,
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE:
      return {
        ...state,
        firstPanelView: LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case LayoutEditorPaneActionTypes.SHOW_NPA_PASSPHRASE:
      return {
        ...state,
        firstPanelView: LayoutEditorPaneActionTypes.SHOW_NPA_PASSPHRASE
      };
    case LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL:
      return {
        ...state,
        firstPanelView: LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL,
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
    case LayoutEditorDataActionTypes.POST_NEW_NPA_KEY:
      return {
        ...state,
        dataAction: LayoutEditorDataActionTypes.POST_NEW_NPA_KEY
      };
    case LayoutEditorDataActionTypes.DATA_ACTION_COMPLETED: {
      return {
        ...state,
        dataAction: LayoutEditorDataActionTypes.DATA_ACTION_COMPLETED,
        data: action.data
      };
    }
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
    case LayoutEditorDataActionTypes.POST_NEW_NPA:
      return {
        ...state,
        dataAction: LayoutEditorDataActionTypes.POST_NEW_NPA,
        data: action.npa
      };
    case LayoutEditorDataActionTypes.PUT_NPA:
      return {
        ...state,
        dataAction: LayoutEditorDataActionTypes.PUT_NPA,
        data: action.npa
      };
    case LayoutEditorDataActionTypes.STORE_SEARCHED_USER:
      return {
        ...state,
        user: action.user
      };
    case LayoutEditorDataActionTypes.REMOVE_SEARCHED_USER: {
      const stateCopy = Object.assign({}, state);
      delete stateCopy["user"];

      return stateCopy;
    }
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

export { layoutEditorReducer, StateContext };
