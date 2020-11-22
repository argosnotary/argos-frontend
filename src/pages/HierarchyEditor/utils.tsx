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
import {
  appendNodeChildrenToParent,
  appendSingleNode,
  removeNode,
  updateSingleNode
} from "../../molecules/TreeEditor/utils";
import {
  ITreeReducerState,
  TreeReducerAction,
  TreeReducerActionTypes
} from "../../stores/treeEditorStore";
import ITreeNode from "../../interfaces/ITreeNode";
import {
  IHierarchyEditorStateContextState,
  IHierarchyEditorStateContextDispatch,
  HierarchyEditorActionTypes,
  HierarchyEditorPanelModes
} from "../../stores/hierarchyEditorStore";

const appendLabelChildrenToTree = (
  treeState: ITreeReducerState,
  treeDispatch: (msg: TreeReducerAction) => void,
  parentNode: ITreeNode
) => {
  if (parentNode && parentNode.children) {
    const newState = appendNodeChildrenToParent(
      parentNode,
      parentNode.children
    );

    treeDispatch({
      type: TreeReducerActionTypes.STOREDATA,
      data: newState(treeState).data
    });
  }
};

const removeObjectFromTree = (
  hierarchyEditorState: IHierarchyEditorStateContextState,
  hierarchyEditorDispatch: IHierarchyEditorStateContextDispatch
) => {
  const node: ITreeNode = hierarchyEditorState.editor.node;

  const newState = removeNode(node, node.parentId);
  hierarchyEditorDispatch.tree({
    type: TreeReducerActionTypes.STOREDATA,
    data: newState(hierarchyEditorState.tree).data
  });

  hierarchyEditorDispatch.tree({
    type: TreeReducerActionTypes.UPDATETOGGLEDNODES,
    id: node.parentId || ""
  });

  hierarchyEditorDispatch.editor({
    type: HierarchyEditorActionTypes.UPDATE_PANEL_MODE,
    mode: HierarchyEditorPanelModes.UPDATE
  });
};

const addObjectToTree = (
  hierarchyEditorState: IHierarchyEditorStateContextState,
  hierarchyEditorDispatch: IHierarchyEditorStateContextDispatch,
  node: ITreeNode
) => {
  if (hierarchyEditorState.editor.node.referenceId) {
    node.parentId = hierarchyEditorState.editor.node.referenceId;
  }

  const newState = appendSingleNode(node, node.parentId);

  hierarchyEditorDispatch.tree({
    type: TreeReducerActionTypes.STOREDATA,
    data: newState(hierarchyEditorState.tree).data
  });

  hierarchyEditorDispatch.tree({
    type: TreeReducerActionTypes.UPDATETOGGLEDNODES,
    id: node.parentId || ""
  });

  hierarchyEditorDispatch.editor({
    type: HierarchyEditorActionTypes.UPDATE_NODE,
    node
  });

  hierarchyEditorDispatch.editor({
    type: HierarchyEditorActionTypes.UPDATE_PANEL_MODE,
    mode: HierarchyEditorPanelModes.UPDATE
  });
};

const updateTreeObject = (
  hierarchyEditorState: IHierarchyEditorStateContextState,
  hierarchyEditorDispatch: IHierarchyEditorStateContextDispatch,
  node: ITreeNode
) => {
  const newState = updateSingleNode(node);
  const data = newState(hierarchyEditorState.tree).data;

  hierarchyEditorDispatch.tree({
    type: TreeReducerActionTypes.STOREDATA,
    data
  });

  hierarchyEditorDispatch.editor({
    type: HierarchyEditorActionTypes.UPDATE_NODE,
    node
  });
};

export {
  addObjectToTree,
  appendLabelChildrenToTree,
  updateTreeObject,
  removeObjectFromTree
};
