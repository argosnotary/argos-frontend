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
import styled from "styled-components";

import DataRequest from "../../types/DataRequest";
import FlexColumn from "../../atoms/FlexColumn";
import FlexRow from "../../atoms/FlexRow";

import ITreeNode from "../../interfaces/ITreeNode";
import TreeEditor from "../../molecules/TreeEditor/TreeEditor";
import useDataApi from "../../hooks/useDataApi";
import useToken from "../../hooks/useToken";
import {
  initialTreeState,
  TreeStateContext,
  treeReducer
} from "../../stores/treeEditorStore";

import { buildNodeTrail } from "../../molecules/TreeEditor/utils";

import {
  editorReducer,
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
import genericDataFetchReducer from "../../stores/genericDataFetchReducer";
import ManageSupplyChain from "./Panels/ManageSupplyChain";

const PanelsContainer = styled.section`
  width: 75vw;
`;

const Panel = styled.section`
  background-color: ${props => props.theme.layoutPage.panel.bgColor};
  border: 1rem solid ${props => props.theme.layoutPage.panel.borderColor};
  border-left-width: 0;
  padding: 1rem;
  height: 100vh;
  width: 50%;
  display: flex;
  flex-direction: column;
`;

const SecondPanel = styled(Panel)`
  height: 100vh;
`;

const LayoutEditor = () => {
  const [state, dispatch] = useReducer(editorReducer, {
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

  const [treeDataState] = useDataApi(
    genericDataFetchReducer,
    getTreeDataRequest
  );

  const [treeState, treeDispatch] = useReducer(treeReducer, initialTreeState);
  const [treeChildrenFetchState, setTreeChildrenFetchRequest] = useDataApi(
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
      type,
      nodeReferenceId: node.referenceId,
      nodeParentId: trail.length > 1 ? trail[trail.length - 2].referenceId : "",
      breadcrumb,
      selectedNodeName
    });
  };

  const treeContextMenu = [
    {
      type: "LABEL",
      menuitems: [
        {
          label: "Add label",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE,
              node
            );
          }
        },
        {
          label: "Update label",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE,
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
        }
      ]
    },
    {
      type: "SUPPLY_CHAIN",
      menuitems: [
        {
          label: "Update supply chain",
          callback: (node: ITreeNode) => {
            treeContextMenuCb(
              LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE,
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

    setTreeChildrenFetchRequest(dataRequest);
  };

  const renderPanel = (panelView: string) => {
    switch (panelView) {
      case LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE:
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE:
        return <ManageLabel />;
      case LayoutEditorPaneActionTypes.SHOW_ADD_SUPPLY_CHAIN_PANE:
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_SUPPLY_CHAIN_PANE:
        return <ManageSupplyChain />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (
      state.dataAction &&
      state.dataAction === LayoutEditorDataActionTypes.POST_NEW_LABEL
    ) {
      appendObjectToTree(
        treeState,
        treeDispatch,
        dispatch,
        state.data,
        "LABEL"
      );
    }

    if (
      state.dataAction &&
      state.dataAction === LayoutEditorDataActionTypes.POST_SUPPLY_CHAIN
    ) {
      appendObjectToTree(
        treeState,
        treeDispatch,
        dispatch,
        state.data,
        "SUPPLY_CHAIN"
      );
    }

    if (
      state.dataAction &&
      (state.dataAction === LayoutEditorDataActionTypes.PUT_LABEL ||
        state.dataAction === LayoutEditorDataActionTypes.PUT_SUPPLY_CHAIN)
    ) {
      updateObjectInTree(treeState, treeDispatch, dispatch, state.data);
    }
  }, [state.data, state.dataAction]);

  return (
    <FlexColumn>
      <FlexRow disableWrap={true}>
        <StateContext.Provider value={[state, dispatch]}>
          <TreeStateContext.Provider
            value={[
              treeState,
              treeDispatch,
              treeStringList,
              treeContextMenu,
              cbCreateRootNode,
              cbGetNodeChildren,
              treeChildrenFetchState.isLoading,
              state.nodeReferenceId
            ]}
          >
            <TreeEditor
              data={treeDataState.data}
              loading={treeDataState.isLoading}
            />
          </TreeStateContext.Provider>
          <PanelsContainer>
            <FlexRow>
              <Panel>{renderPanel(state.firstPanelView)}</Panel>
              <SecondPanel>&nbsp;</SecondPanel>
            </FlexRow>
          </PanelsContainer>
        </StateContext.Provider>
      </FlexRow>
    </FlexColumn>
  );
};

export default LayoutEditor;
export { StateContext };
