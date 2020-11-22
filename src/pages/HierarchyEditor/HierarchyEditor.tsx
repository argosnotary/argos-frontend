/*
 * Copyright (C) 2020 Argos Notary
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
import React, { useContext, useReducer } from "react";

import DataRequest from "../../types/DataRequest";
import FlexColumn from "../../atoms/FlexColumn";
import FlexRow from "../../atoms/FlexRow";

import ITreeNode from "../../interfaces/ITreeNode";
import TreeEditor from "../../molecules/TreeEditor/TreeEditor";
import useDataApi from "../../hooks/useDataApi";
import {
  initialTreeState,
  ITreeStateContext,
  treeReducer
} from "../../stores/treeEditorStore";

import { buildNodeTrail } from "../../molecules/TreeEditor/utils";

import { appendLabelChildrenToTree } from "./utils";
import ManageLabel from "./Panels/ManageLabel";
import genericDataFetchReducer, {
  customGenericDataFetchReducer
} from "../../stores/genericDataFetchReducer";
import ManageSupplyChain from "./Panels/ManageSupplyChain";
import ManageServiceAccount from "./Panels/ManageServiceAccount/ManageServiceAccount";
import { Panel, PanelsContainer } from "../../molecules/Panel";
import ManageLabelPermissions from "./Panels/ManageLabelPermissions";
import ITreeContextMenuEntry from "../../interfaces/ITreeContextMenuEntry";
import { PermissionTypes } from "../../types/PermissionType";
import { FormPermissions } from "../../types/FormPermission";
import { useUserProfileContext } from "../../stores/UserProfile";
import ManageLayoutPanel from "./Panels/ManageLayout/ManageLayoutPanel";
import ManageApprovalExecutionPanel from "./Panels/ManageApprovalExecution/ManageApprovalExecutionPanel";
import ApproveIcon from "../../atoms/Icons/ApproveIcon";
import { ThemeContext } from "styled-components";
import {
  HierarchyEditorActionTypes,
  HierarchyEditorPanelModes,
  HierarchyEditorPanelTypes,
  hierarchyEditorReducer,
  HierarchyEditorStateContext,
  IHierarchyEditorState
} from "../../stores/hierarchyEditorStore";
import ReleaseExecutionDetailsPanel from "./Panels/ManageReleaseExecution/ReleaseExecutionDetailsPanel";

const HierarchyEditor = () => {
  const [hierarchyEditorState, hierarchyEditorDispatch] = useReducer(
    hierarchyEditorReducer,
    {} as IHierarchyEditorState
  );

  const theme = useContext(ThemeContext);

  const getTreeDataRequest: DataRequest = {
    method: "get",
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

  const getPanelPermission = (
    node: ITreeNode,
    panelType: HierarchyEditorPanelTypes
  ) => {
    let userHasEditPermission = false;
    switch (panelType) {
      case HierarchyEditorPanelTypes.MANAGE_LAYOUT:
        userHasEditPermission =
          node.permissions !== undefined &&
          node.permissions.indexOf(PermissionTypes.LAYOUT_ADD) >= 0;
        break;
      case HierarchyEditorPanelTypes.SERVICE_ACCOUNT:
        userHasEditPermission =
          node.permissions !== undefined &&
          node.permissions.indexOf(PermissionTypes.SERVICE_ACCOUNT_EDIT) >= 0;
        break;
      default:
        userHasEditPermission =
          node.permissions !== undefined &&
          node.permissions.indexOf(PermissionTypes.TREE_EDIT) >= 0;
        break;
    }
    return userHasEditPermission ? FormPermissions.EDIT : FormPermissions.READ;
  };

  const treeContextMenuCallback = (
    panel: HierarchyEditorPanelTypes,
    mode: HierarchyEditorPanelModes,
    node: ITreeNode
  ) => {
    const trail = buildNodeTrail([], treeState.data, node.referenceId);
    const breadcrumb = Array.from(trail.slice(0, -1), t => t.name).join(" / ");
    const extendedNode = { ...node };

    cbGetNodeChildren(node.referenceId);

    if (trail.length > 1) {
      extendedNode["parentId"] = trail[trail.length - 2].referenceId;
    }

    hierarchyEditorDispatch({
      type: HierarchyEditorActionTypes.SET_PANEL,
      node: extendedNode,
      breadcrumb,
      permission: getPanelPermission(node, panel),
      panel,
      mode
    });
  };

  const treeClickHandlers = [
    {
      type: "LABEL",
      callback: (node: ITreeNode) => {
        treeContextMenuCallback(
          HierarchyEditorPanelTypes.LABEL,
          HierarchyEditorPanelModes.UPDATE,
          node
        );
      }
    },
    {
      type: "SUPPLY_CHAIN",
      callback: (node: ITreeNode) => {
        treeContextMenuCallback(
          HierarchyEditorPanelTypes.SUPPLY_CHAIN,
          HierarchyEditorPanelModes.UPDATE,
          node
        );
      }
    },
    {
      type: "SERVICE_ACCOUNT",
      callback: (node: ITreeNode) => {
        treeContextMenuCallback(
          HierarchyEditorPanelTypes.SERVICE_ACCOUNT,
          HierarchyEditorPanelModes.UPDATE,
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
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.LABEL,
              HierarchyEditorPanelModes.CREATE,
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
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.SUPPLY_CHAIN,
              HierarchyEditorPanelModes.CREATE,
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
          label: "Add service account",
          callback: (node: ITreeNode) => {
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.SERVICE_ACCOUNT,
              HierarchyEditorPanelModes.CREATE,
              node
            );
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.SERVICE_ACCOUNT_EDIT) >=
                0
            );
          }
        },

        {
          label: "Manage permissions",
          callback: (node: ITreeNode) => {
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.MANAGE_LABEL_PERMISSIONS,
              HierarchyEditorPanelModes.DEFAULT,
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
        },
        {
          label: "Remove label",
          callback: (node: ITreeNode) => {
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.LABEL,
              HierarchyEditorPanelModes.DELETE,
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
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.MANAGE_LAYOUT,
              HierarchyEditorPanelModes.DEFAULT,
              node
            );
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.LAYOUT_ADD) >= 0
            );
          }
        },
        {
          icon: (
            <ApproveIcon
              size={16}
              color={theme.treeEditor.nodeContextMenuItem.iconColor}
            />
          ),
          label: "Approve step",
          callback: (node: ITreeNode) => {
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.EXECUTE_APPROVAL,
              HierarchyEditorPanelModes.DEFAULT,
              node
            );
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.LINK_ADD) >= 0
            );
          }
        },

        {
          label: "Release",
          callback: (node: ITreeNode) => {
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.EXECUTE_RELEASE,
              HierarchyEditorPanelModes.DEFAULT,
              node
            );
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.RELEASE) >= 0
            );
          }
        },
        {
          label: "Remove supply chain",
          callback: (node: ITreeNode) => {
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.SUPPLY_CHAIN,
              HierarchyEditorPanelModes.DELETE,
              node
            );
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.TREE_EDIT) >= 0
            );
          }
        }
      ]
    },
    {
      type: "SERVICE_ACCOUNT",
      menuitems: [
        {
          label: "Generate new key for service account",
          callback: (node: ITreeNode) => {
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR,
              HierarchyEditorPanelModes.CREATE,
              node
            );
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.SERVICE_ACCOUNT_EDIT) >=
                0
            );
          }
        },
        {
          label: "Remove service account",
          callback: (node: ITreeNode) => {
            treeContextMenuCallback(
              HierarchyEditorPanelTypes.SERVICE_ACCOUNT,
              HierarchyEditorPanelModes.DELETE,
              node
            );
          },
          visible: (node: ITreeNode) => {
            return (
              node.permissions !== undefined &&
              node.permissions.indexOf(PermissionTypes.SERVICE_ACCOUNT_EDIT) >=
                0
            );
          }
        }
      ]
    }
  ];

  const cbCreateRootNode = () => {
    hierarchyEditorDispatch({
      type: HierarchyEditorActionTypes.SET_PANEL,
      node: {} as ITreeNode,
      breadcrumb: "",
      permission: FormPermissions.EDIT,
      panel: HierarchyEditorPanelTypes.LABEL,
      mode: HierarchyEditorPanelModes.CREATE
    });
  };

  const cbGetNodeChildren = (parentId: string) => {
    const dataRequest: DataRequest = {
      params: {
        HierarchyMode: "MAX_DEPTH"
      },
      method: "get",
      url: `/api/hierarchy/${parentId}`,
      cbSuccess: (node: ITreeNode) => {
        appendLabelChildrenToTree(treeState, treeDispatch, node);
      }
    };

    setTreeChildrenApiRequest(dataRequest);
  };

  const renderSelectedPanel = (panel: HierarchyEditorPanelTypes) => {
    switch (panel) {
      case HierarchyEditorPanelTypes.LABEL:
        return <ManageLabel />;
      case HierarchyEditorPanelTypes.SUPPLY_CHAIN:
        return <ManageSupplyChain />;
      case HierarchyEditorPanelTypes.SERVICE_ACCOUNT:
      case HierarchyEditorPanelTypes.SERVICE_ACCOUNT_KEY_GENERATOR:
        return <ManageServiceAccount />;
      case HierarchyEditorPanelTypes.MANAGE_LABEL_PERMISSIONS:
        return <ManageLabelPermissions />;
      case HierarchyEditorPanelTypes.MANAGE_LAYOUT:
        return <ManageLayoutPanel />;
      case HierarchyEditorPanelTypes.EXECUTE_APPROVAL:
        return <ManageApprovalExecutionPanel />;
      case HierarchyEditorPanelTypes.EXECUTE_RELEASE:
        return <ReleaseExecutionDetailsPanel />;
      default:
        return null;
    }
  };

  const userProfile = useUserProfileContext();

  const canCreateRootNode = (): boolean => {
    return (
      userProfile &&
      userProfile.profile !== undefined &&
      userProfile.profile.hasPermission(PermissionTypes.TREE_EDIT)
    );
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
    selectedNodeReferenceId: hierarchyEditorState.node
      ? hierarchyEditorState.node.referenceId
      : ""
  };

  return (
    <FlexColumn>
      <FlexRow disableWrap={true}>
        <HierarchyEditorStateContext.Provider
          value={[
            {
              tree: treeState,
              editor: hierarchyEditorState
            },
            { editor: hierarchyEditorDispatch, tree: treeDispatch }
          ]}>
          <PanelsContainer>
            <FlexRow disableWrap={true}>
              <Panel
                width={"25vw"}
                title={"Hierarchy"}
                disableFlexGrow={true}
                resizable={true}>
                <TreeEditor
                  data={treeDataState.data}
                  loading={treeDataState.isLoading}
                  context={treeContext}
                />
              </Panel>
              {renderSelectedPanel(hierarchyEditorState.panel)}
            </FlexRow>
          </PanelsContainer>
        </HierarchyEditorStateContext.Provider>
      </FlexRow>
    </FlexColumn>
  );
};

export default HierarchyEditor;
