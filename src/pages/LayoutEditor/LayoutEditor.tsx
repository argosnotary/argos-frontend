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
import {
  initialTreeState,
  ITreeStateContext,
  treeReducer
} from "../../stores/treeEditorStore";

import { buildNodeTrail } from "../../molecules/TreeEditor/utils";

import {
  layoutEditorReducer,
  StateContext,
  LayoutEditorDataActionTypes,
  LayoutEditorPaneActionTypes,
  LayoutEditorPaneActionType
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
import { PanelsContainer, Panel } from "../../molecules/Panel";
import ManageLabelPermissions from "./Panels/ManageLabelPermissions";
import ITreeContextMenuEntry from "../../interfaces/ITreeContextMenuEntry";
import { PermissionTypes } from "../../types/PermissionType";
import { FormPermissions } from "../../types/FormPermission";
import { useUserProfileContextStore } from "../../stores/UserProfile";
import ManageLayoutPanel from "./Panels/ManageLayoutPanel";

const LayoutEditor = () => {
  const [state, dispatch] = useReducer(layoutEditorReducer, {
    firstPanelView: LayoutEditorPaneActionTypes.NONE,
    nodeReferenceId: "",
    nodeParentId: "",
    breadcrumb: "",
    selectedNodeName: "",
    panePermission: FormPermissions.READ
  });

  const [localStorageToken] = useToken();
  const getTreeDataRequest: DataRequest = {
    method: "get",
    token: localStorageToken,
    url: "/api/hierarchy"
  };

  interface ITreeDataState {
    isLoading: boolean;
    data: Array<ITreeNode>;
  }

  const [treeDataState] = useDataApi<ITreeDataState, Array<ITreeNode>>(
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

  const getPanePermission = (
    node: ITreeNode,
    paneActionType: LayoutEditorPaneActionTypes
  ) => {
    let userHasEditPermission = false;
    switch (paneActionType) {
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE:
      case LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE:
        userHasEditPermission =
          node.permissions !== undefined &&
          node.permissions.indexOf(PermissionTypes.NPA_EDIT) >= 0;
        break;
      case LayoutEditorPaneActionTypes.SHOW_MANAGE_LAYOUT:
        userHasEditPermission =
          node.permissions !== undefined &&
          node.permissions.indexOf(PermissionTypes.LAYOUT_ADD) >= 0;
        break;
      default:
        userHasEditPermission =
          node.permissions !== undefined &&
          node.permissions.indexOf(PermissionTypes.TREE_EDIT) >= 0;
        break;
    }
    return userHasEditPermission ? FormPermissions.EDIT : FormPermissions.READ;
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
      panePermission: getPanePermission(node, type),
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

  const treeContextMenu: Array<ITreeContextMenuEntry> = [
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
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.TREE_EDIT) >= 0
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
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.TREE_EDIT) >= 0
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
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.NPA_EDIT) >= 0
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
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.LOCAL_PERMISSION_EDIT) >=
                0
            );
          }
        }
      ]
    },
    {
      type: "SUPPLY_CHAIN",
      menuitems: [
        {
          label: "manage layout",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_MANAGE_LAYOUT,
              node
            );
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.LAYOUT_ADD) >= 0
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
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.NPA_EDIT) >= 0
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
      selectedNodeName: "",
      panePermission: FormPermissions.EDIT
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
      case LayoutEditorPaneActionTypes.SHOW_MANAGE_LAYOUT:
        return <ManageLayoutPanel />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (
      (state.dataAction &&
        state.dataAction === LayoutEditorDataActionTypes.POST_NEW_LABEL) ||
      state.dataAction === LayoutEditorDataActionTypes.POST_NEW_NPA ||
      state.dataAction === LayoutEditorDataActionTypes.POST_SUPPLY_CHAIN
    ) {
      const hierarchyDataRequest: DataRequest = {
        params: {
          HierarchyMode: "NONE"
        },
        method: "get",
        token: localStorageToken,
        url: `/api/hierarchy/${state.data.id}`,
        cbSuccess: (node: ITreeNode) => {
          appendObjectToTree(
            treeState,
            treeDispatch,
            node,
            state.data.parentLabelId
          );
          dispatch({
            type: LayoutEditorDataActionTypes.DATA_ACTION_COMPLETED,
            data: state.data
          });
        }
      };
      setTreeChildrenApiRequest(hierarchyDataRequest);
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

  const userProfile = useUserProfileContextStore();

  const canCreateRootNode = (): boolean => {
    return userProfile && userProfile.hasPermission(PermissionTypes.TREE_EDIT);
  };

  const treeContext: ITreeStateContext = {
    treeState,
    treeDispatch,
    treeStringList,
    treeContextMenu,
    treeClickHandlers,
    cbCreateRootNode,
    canCreateRootNode,
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
              {renderPanel(state.firstPanelView)}
            </FlexRow>
          </PanelsContainer>
        </StateContext.Provider>
      </FlexRow>
    </FlexColumn>
  );
};

export default LayoutEditor;
export { StateContext };
