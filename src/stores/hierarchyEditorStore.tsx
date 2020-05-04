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

interface IHierarchyEditorState {
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

export enum HierarchyEditorDataActionTypes {
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

export enum HierarchyEditorPaneActionTypes {
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
  SHOW_MANAGE_LAYOUT = "SHOW_MANAGE_LAYOUT",
  RESET_PANE = "RESET_PANE"
}

export type LayoutEditorPaneActionType =
  | HierarchyEditorPaneActionTypes.SHOW_ADD_LABEL_PANE
  | HierarchyEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS
  | HierarchyEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE
  | HierarchyEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE
  | HierarchyEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE
  | HierarchyEditorPaneActionTypes.SHOW_ADD_NPA_PANE
  | HierarchyEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE
  | HierarchyEditorPaneActionTypes.SHOW_NPA_PASSPHRASE
  | HierarchyEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL
  | HierarchyEditorPaneActionTypes.SHOW_MANAGE_LAYOUT
  | HierarchyEditorPaneActionTypes.RESET_PANE;

export type HierarchyEditorPaneAction =
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_ADD_LABEL_PANE;
      nodeParentId: string;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
      panePermission: FormPermission;
    }
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS;
      nodeParentId: string;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
      panePermission: FormPermission;
    }
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
      nodeParentId: string;
      panePermission: FormPermission;
    }
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
      panePermission: FormPermission;
    }
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_ADD_NPA_PANE;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
      nodeParentId: string;
      panePermission: FormPermission;
    }
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
      panePermission: FormPermission;
    }
  | { type: HierarchyEditorPaneActionTypes.SHOW_NPA_PASSPHRASE }
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | {
      type: HierarchyEditorPaneActionTypes.SHOW_MANAGE_LAYOUT;
      nodeParentId: string;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
      panePermission: FormPermission;
    }
  | { type: HierarchyEditorPaneActionTypes.RESET_PANE };

interface IDataActionCompleted {
  type: HierarchyEditorDataActionTypes.DATA_ACTION_COMPLETED;
  data: any;
}

interface IStoredSearchedUser {
  id: string;
  name: string;
}

export type HierarchyEditorDataAction =
  | IDataActionCompleted
  | {
      type: HierarchyEditorDataActionTypes.POST_NEW_LABEL;
      label: ILabelPostResponse;
    }
  | {
      type: HierarchyEditorDataActionTypes.PUT_LABEL;
      label: ILabelPostResponse;
    }
  | {
      type: HierarchyEditorDataActionTypes.POST_SUPPLY_CHAIN;
      supplyChain: ISupplyChainApiResponse;
    }
  | {
      type: HierarchyEditorDataActionTypes.PUT_SUPPLY_CHAIN;
      supplyChain: ISupplyChainApiResponse;
    }
  | {
      type: HierarchyEditorDataActionTypes.POST_NEW_NPA;
      npa: INpaApiResponse;
    }
  | {
      type: HierarchyEditorDataActionTypes.POST_NEW_NPA_KEY;
    }
  | {
      type: HierarchyEditorDataActionTypes.PUT_NPA;
      npa: INpaApiResponse;
    }
  | {
      type: HierarchyEditorDataActionTypes.STORE_SEARCHED_USER;
      user: IStoredSearchedUser;
    }
  | {
      type: HierarchyEditorDataActionTypes.REMOVE_SEARCHED_USER;
    };

export type HierarchyEditorAction =
  | HierarchyEditorPaneAction
  | HierarchyEditorDataAction;

const layoutEditorReducer = (
  state: IHierarchyEditorState,
  action: HierarchyEditorAction
) => {
  switch (action.type) {
    case HierarchyEditorPaneActionTypes.SHOW_ADD_LABEL_PANE:
      return {
        ...state,
        firstPanelView: HierarchyEditorPaneActionTypes.SHOW_ADD_LABEL_PANE,
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case HierarchyEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS:
      return {
        ...state,
        firstPanelView:
          HierarchyEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS,
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case HierarchyEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE:
      return {
        ...state,
        firstPanelView: HierarchyEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case HierarchyEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE:
      return {
        ...state,
        firstPanelView:
          HierarchyEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE,
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case HierarchyEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE:
      return {
        ...state,
        firstPanelView:
          HierarchyEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case HierarchyEditorPaneActionTypes.SHOW_ADD_NPA_PANE:
      return {
        ...state,
        firstPanelView: HierarchyEditorPaneActionTypes.SHOW_ADD_NPA_PANE,
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case HierarchyEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE:
      return {
        ...state,
        firstPanelView: HierarchyEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case HierarchyEditorPaneActionTypes.SHOW_NPA_PASSPHRASE:
      return {
        ...state,
        firstPanelView: HierarchyEditorPaneActionTypes.SHOW_NPA_PASSPHRASE
      };
    case HierarchyEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL:
      return {
        ...state,
        firstPanelView:
          HierarchyEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };

    case HierarchyEditorPaneActionTypes.SHOW_MANAGE_LAYOUT:
      return {
        ...state,
        firstPanelView: HierarchyEditorPaneActionTypes.SHOW_MANAGE_LAYOUT,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName,
        panePermission: action.panePermission
      };
    case HierarchyEditorPaneActionTypes.RESET_PANE:
      return {
        ...state,
        firstPanelView: "",
        nodeReferenceId: "",
        dataAction: ""
      };
    case HierarchyEditorDataActionTypes.POST_NEW_LABEL:
      return {
        ...state,
        dataAction: HierarchyEditorDataActionTypes.POST_NEW_LABEL,
        data: action.label
      };
    case HierarchyEditorDataActionTypes.POST_NEW_NPA_KEY:
      return {
        ...state,
        dataAction: HierarchyEditorDataActionTypes.POST_NEW_NPA_KEY
      };
    case HierarchyEditorDataActionTypes.DATA_ACTION_COMPLETED: {
      return {
        ...state,
        dataAction: HierarchyEditorDataActionTypes.DATA_ACTION_COMPLETED,
        data: action.data
      };
    }
    case HierarchyEditorDataActionTypes.PUT_LABEL: {
      return {
        ...state,
        dataAction: HierarchyEditorDataActionTypes.PUT_LABEL,
        data: action.label
      };
    }
    case HierarchyEditorDataActionTypes.POST_SUPPLY_CHAIN:
      return {
        ...state,
        dataAction: HierarchyEditorDataActionTypes.POST_SUPPLY_CHAIN,
        data: action.supplyChain
      };
    case HierarchyEditorDataActionTypes.PUT_SUPPLY_CHAIN:
      return {
        ...state,
        dataAction: HierarchyEditorDataActionTypes.PUT_SUPPLY_CHAIN,
        data: action.supplyChain
      };
    case HierarchyEditorDataActionTypes.POST_NEW_NPA:
      return {
        ...state,
        dataAction: HierarchyEditorDataActionTypes.POST_NEW_NPA,
        data: action.npa
      };
    case HierarchyEditorDataActionTypes.PUT_NPA:
      return {
        ...state,
        dataAction: HierarchyEditorDataActionTypes.PUT_NPA,
        data: action.npa
      };
    case HierarchyEditorDataActionTypes.STORE_SEARCHED_USER:
      return {
        ...state,
        user: action.user
      };
    case HierarchyEditorDataActionTypes.REMOVE_SEARCHED_USER: {
      const stateCopy = Object.assign({}, state);
      delete stateCopy["user"];

      return stateCopy;
    }
  }
};

const StateContext = React.createContext<
  [IHierarchyEditorState, Dispatch<HierarchyEditorAction>]
>([
  {} as IHierarchyEditorState,
  () => {
    return;
  }
]);

export { layoutEditorReducer, StateContext };
