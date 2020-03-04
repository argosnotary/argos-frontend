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
  TreeReducerAction,
  TreeReducerActionTypes
} from "../../stores/treeEditorStore";
import ITreeNode from "../../interfaces/ITreeNode";
import ILabelPostResponse from "../../interfaces/ILabelPostResponse";
import {
  LayoutEditorDataActionTypes,
  LayoutEditorAction,
  LayoutEditorPaneActionTypes
} from "../../stores/layoutEditorStore";
import ISupplyChainApiResponse from "../../interfaces/ISupplyChainApiResponse";
import { TreeNodeType } from "../../types/TreeNodeType";

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

const appendObjectToTree = (
  treeState: ITreeReducerState,
  treeDispatch: (msg: TreeReducerAction) => void,
  stateDispatch: (msg: LayoutEditorAction) => void,
  object: ILabelPostResponse | ISupplyChainApiResponse,
  type: TreeNodeType
) => {
  const parsedNode: ITreeNode = {
    hasChildren: false,
    referenceId: object.id,
    name: object.name,
    type
  };

  const newState = object.parentLabelId
    ? appendSingleNode(parsedNode, object.parentLabelId)
    : appendSingleNode(parsedNode);

  treeDispatch({
    type: TreeReducerActionTypes.STOREDATA,
    data: newState(treeState).data
  });

  treeDispatch({
    type: TreeReducerActionTypes.UPDATETOGGLEDNODES,
    id: object.parentLabelId || ""
  });

  stateDispatch({
    type: LayoutEditorDataActionTypes.DATA_ACTION_COMPLETED,
    data: object
  });
};

const updateObjectInTree = (
  treeState: ITreeReducerState,
  treeDispatch: (msg: TreeReducerAction) => void,
  stateDispatch: (msg: LayoutEditorAction) => void,
  object: ILabelPostResponse | ISupplyChainApiResponse
) => {
  const currentNode = findNode(treeState.data, object.id);
  const parsedNode = Object.assign({}, currentNode);
  parsedNode.name = object.name;

  const newState = updateSingleNode(parsedNode);

  treeDispatch({
    type: TreeReducerActionTypes.STOREDATA,
    data: newState(treeState).data
  });

  stateDispatch({
    type: LayoutEditorPaneActionTypes.RESET_PANE
  });
};

export { appendObjectToTree, appendLabelChildrenToTree, updateObjectInTree };
