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
import React, { useReducer, useEffect } from "react";

import DataRequest from "../../types/DataRequest";
import FlexColumn from "../../atoms/FlexColumn";
import FlexRow from "../../atoms/FlexRow";

import ITreeNode from "../../interfaces/ITreeNode";
import TreeEditor from "../../molecules/TreeEditor/TreeEditor";
import useDataApi from "../../hooks/useDataApi";
import useToken from "../../hooks/useToken";
import { initialTreeState, treeReducer } from "../../stores/treeEditorStore";

import { buildNodeTrail } from "../../molecules/TreeEditor/utils";

import {
  layoutEditorReducer,
  StateContext,
  LayoutEditorDataActionTypes,
  LayoutEditorPaneActionTypes,
  LayoutEditorPaneActionType,
  LayoutEditorDataActionType
} from "../../stores/layoutEditorStore";
import {
  appendObjectToTree,
  appendLabelChildrenToTree,
  updateObjectInTree
} from "./utils";
import ManageLabel from "./Panels/ManageLabel";
import genericDataFetchReducer, {
  customGenericDataFetchReducer
} from "../../stores/genericDataFetchReducer";
import ManageSupplyChain from "./Panels/ManageSupplyChain";
import ManageNpa from "./Panels/ManageNpa";
import { TreeNodeTypes } from "../../types/TreeNodeType";
import { PanelsContainer, Panel } from "../../molecules/Panel";
import ManageLabelPermissions from "./Panels/ManageLabelPermissions";

const LayoutEditor = () => {
  const [state, dispatch] = useReducer(layoutEditorReducer, {
    firstPanelView: LayoutEditorPaneActionTypes.NONE,
    nodeReferenceId: "",
    nodeParentId: "",
    breadcrumb: "",
    selectedNodeName: ""
  });
  const [localStorageToken] = useToken();
  const getTreeDataRequest: DataRequest = {
    method: "get",
    token: localStorageToken,
    url: "/api/hierarchy"
  };

  interface ITreeDataStateNode {
    name: string;
    type: string;
    referenceId: string;
    hasChildren: boolean;
    children: Array<ITreeDataStateNode>;
    permissions: Array<string>;
  }

  interface ITreeDataState {
    isLoading: boolean;
    data: Array<ITreeDataStateNode>;
  }

  const [treeDataState] = useDataApi<ITreeDataState, Array<ITreeDataStateNode>>(
    customGenericDataFetchReducer,
    getTreeDataRequest
  );

  const [treeState, treeDispatch] = useReducer(treeReducer, initialTreeState);
  const [treeChildrenApiResponse, setTreeChildrenApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const treeStringList = {
    createrootnode: "Create base label..."
  };

  const treeContextMenuCb = (
    type: LayoutEditorPaneActionType,
    node: ITreeNode
  ) => {
    const trail = buildNodeTrail([], treeState.data, node.referenceId);
    const breadcrumb = Array.from(trail.slice(0, -1), t => t.name).join(" / ");
    const selectedNodeName = Array.from(trail.slice(-1))[0].name;

    dispatch({
      type: LayoutEditorPaneActionTypes.RESET_PANE
    });

    dispatch({
      type,
      nodeReferenceId: node.referenceId,
      nodeParentId: trail.length > 1 ? trail[trail.length - 2].referenceId : "",
      breadcrumb,
      selectedNodeName
    });
  };

  const treeClickHandlers = [
    {
      type: "LABEL",
      callback: (node: ITreeNode) => {
        treeContextMenuCb(
          LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE,
          node
        );
      }
    },
    {
      type: "SUPPLY_CHAIN",
      callback: (node: ITreeNode) => {
        treeContextMenuCb(
          LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE,
          node
        );
      }
    },
    {
      type: "NON_PERSONAL_ACCOUNT",
      callback: (node: ITreeNode) => {
        treeContextMenuCb(
          LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE,
          node
        );
      }
    }
  ];

  const treeContextMenu = [
    {
      type: "LABEL",
      menuitems: [
        {
          label: "Add child label",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE,
              node
            );
          }
        },
        {
          label: "Add supply chain",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE,
              node
            );
          }
        },
        {
          label: "Add npa",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE,
              node
            );
          }
        },
        {
          label: "Manage permissions",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS,
              node
            );
          }
        }
      ]
    },
    {
      type: "NON_PERSONAL_ACCOUNT",
      menuitems: [
        {
          label: "Generate new key for npa",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL,
              node
            );
          }
        }
      ]
    }
  ];

  const cbCreateRootNode = () => {
    dispatch({
      type: LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE,
      nodeReferenceId: "",
      nodeParentId: "",
      breadcrumb: "",
      selectedNodeName: ""
    });
  };

  const cbGetNodeChildren = (parentId: string) => {
    const dataRequest: DataRequest = {
      params: {
        HierarchyMode: "MAX_DEPTH"
      },
      method: "get",
      token: localStorageToken,
      url: `/api/hierarchy/${parentId}`,
      cbSuccess: (node: ITreeNode) => {
        appendLabelChildrenToTree(treeState, treeDispatch, node);
      }
    };

    setTreeChildrenApiRequest(dataRequest);
  };

  const renderPanel = (panelView: string) => {
    switch (panelView) {
      case LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE:
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE:
        return <ManageLabel />;
      case LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE:
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE:
        return <ManageSupplyChain />;
      case LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE:
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE:
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL:
        return <ManageNpa />;
      case LayoutEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS:
        return <ManageLabelPermissions />;
      default:
        return null;
    }
  };

  const getNodeTypeFromAction = (action: LayoutEditorDataActionType) => {
    switch (action) {
      case LayoutEditorDataActionTypes.POST_NEW_LABEL:
        return TreeNodeTypes.LABEL;
      case LayoutEditorDataActionTypes.POST_SUPPLY_CHAIN:
        return TreeNodeTypes.SUPPLY_CHAIN;
      case LayoutEditorDataActionTypes.POST_NEW_NPA:
        return TreeNodeTypes.NON_PERSONAL_ACCOUNT;
      default:
        return TreeNodeTypes.UNSPECIFIED;
    }
  };

  const getPanelTitleFromState = (pane: string): string => {
    switch (pane) {
      case LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE:
        return "Add child label to selected label";
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE:
        return "Update selected label";
      case LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE:
        return "Add supply chain to label";
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE:
        return "Update selected supply chain";
      case LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE:
        return "Add non personal account to label";
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_KEY_MODAL:
        return "Generate new key for npa";
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE:
        return "Update selected non personal account";
      case LayoutEditorPaneActionTypes.SHOW_MANAGE_LABEL_PERMISSIONS:
        return "Manage label permissions";
    }

    return "";
  };

  useEffect(() => {
    if (
      (state.dataAction &&
        state.dataAction === LayoutEditorDataActionTypes.POST_NEW_LABEL) ||
      state.dataAction === LayoutEditorDataActionTypes.POST_NEW_NPA ||
      state.dataAction === LayoutEditorDataActionTypes.POST_SUPPLY_CHAIN
    ) {
      appendObjectToTree(
        treeState,
        treeDispatch,
        dispatch,
        state.data,
        getNodeTypeFromAction(state.dataAction as LayoutEditorDataActionType)
      );
    }

    if (
      state.dataAction &&
      (state.dataAction === LayoutEditorDataActionTypes.PUT_LABEL ||
        state.dataAction === LayoutEditorDataActionTypes.PUT_SUPPLY_CHAIN ||
        state.dataAction === LayoutEditorDataActionTypes.PUT_NPA)
    ) {
      updateObjectInTree(treeState, treeDispatch, dispatch, state.data);
    }
  }, [state.data, state.dataAction]);

  const treeContext = {
    treeState,
    treeDispatch,
    treeStringList,
    treeContextMenu,
    treeClickHandlers,
    cbCreateRootNode,
    cbGetNodeChildren,
    isLoading: treeChildrenApiResponse.isLoading,
    selectedNodeReferenceId: state.nodeReferenceId
  };

  return (
    <FlexColumn>
      <FlexRow disableWrap={true}>
        <StateContext.Provider value={[state, dispatch]}>
          <PanelsContainer>
            <FlexRow disableWrap={true}>
              <Panel
                width={"25vw"}
                title={"Hierarchy"}
                disableFlexGrow={true}
                resizable={true}
              >
                <TreeEditor
                  data={treeDataState.data}
                  loading={treeDataState.isLoading}
                  context={treeContext}
                />
              </Panel>
              <Panel
                width={"37.5vw"}
                title={getPanelTitleFromState(state.firstPanelView)}
              >
                {renderPanel(state.firstPanelView)}
              </Panel>
              <Panel width={"37.5vw"} last={true}>
                &nbsp;
              </Panel>
            </FlexRow>
          </PanelsContainer>
        </StateContext.Provider>
      </FlexRow>
    </FlexColumn>
  );
};

export default LayoutEditor;
export { StateContext };
