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
import {
  appendSingleNode,
  appendNodeChildrenToParent,
  updateSingleNode,
  findNode
} from "../../molecules/TreeEditor/utils";
import {
  ITreeReducerState,
  TreeReducerAction
} from "../../stores/treeEditorStore";
import ITreeNode from "../../interfaces/ITreeNode";
import ILabelPostResponse from "../../interfaces/ILabelPostResponse";
import { LayoutEditorAction } from "../../stores/layoutEditorStore";

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
      type: "storedata",
      data: newState(treeState).data
    });
  }
};

const appendNewLabelToTree = (
  treeState: ITreeReducerState,
  treeDispatch: (msg: TreeReducerAction) => void,
  stateDispatch: (msg: LayoutEditorAction) => void,
  label: ILabelPostResponse
) => {
  const parsedNode: ITreeNode = {
    hasChildren: false,
    referenceId: label.id,
    name: label.name,
    type: "LABEL"
  };

  const newState = label.parentLabelId
    ? appendSingleNode(parsedNode, label.parentLabelId)
    : appendSingleNode(parsedNode);

  treeDispatch({
    type: "storedata",
    data: newState(treeState).data
  });

  treeDispatch({
    type: "updatetogglednodes",
    id: label.parentLabelId || ""
  });

  stateDispatch({
    type: "resetpane"
  });
};

const updateLabelInTree = (
  treeState: ITreeReducerState,
  treeDispatch: (msg: TreeReducerAction) => void,
  stateDispatch: (msg: LayoutEditorAction) => void,
  label: ILabelPostResponse
) => {
  const currentNode = findNode(treeState.data, label.id);
  const parsedNode = Object.assign({}, currentNode);
  parsedNode.name = label.name;

  const newState = updateSingleNode(parsedNode);

  treeDispatch({
    type: "storedata",
    data: newState(treeState).data
  });

  stateDispatch({
    type: "resetpane"
  });
};

export { appendNewLabelToTree, appendLabelChildrenToTree, updateLabelInTree };
