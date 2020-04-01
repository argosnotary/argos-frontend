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
import ITreeNode from "../../interfaces/ITreeNode";
import produce from "immer";
import { ITreeReducerState } from "../../stores/treeEditorStore";

const findNode = (
  nodes: Array<ITreeNode>,
  id: string
): ITreeNode | undefined => {
  if (nodes.length == 0) return;

  return (
    nodes.find(n => n.referenceId === id) ||
    findNode(
      nodes.flatMap(n => n.children || []),
      id
    )
  );
};

const getNearestParent = (
  parentNode: ITreeNode | [],
  nodes: Array<ITreeNode>,
  id: string
): Array<ITreeNode> => {
  return nodes
    .map(node => {
      if (node.referenceId === id) {
        return [parentNode, node];
      }

      if (node.children && node.children.length > 0) {
        return getNearestParent(node, node.children, id).flat();
      }

      return [];
    })
    .flat();
};

const buildNodeTrail = (
  trail: Array<ITreeNode>,
  nodes: Array<ITreeNode>,
  selectedNode: string
): Array<ITreeNode> => {
  const res = getNearestParent([], nodes, selectedNode);
  trail.push(res[1]);

  if (Object.keys(res[0]).length > 0) {
    return buildNodeTrail(trail, nodes, res[0].referenceId);
  }

  return trail.reverse();
};

const appendSingleNode = (node: ITreeNode, parentLabelId?: string) => {
  return produce((draftState: ITreeReducerState) => {
    if (parentLabelId) {
      const parentNode = findNode(draftState.data, parentLabelId);
      if (parentNode?.hasChildren && parentNode.children) {
        parentNode.children.push(node);
      } else if (parentNode) {
        parentNode.children = [node];
        parentNode.hasChildren = true;
      }
    } else {
      draftState.data.push(node);
    }
  });
};

const appendNodeChildrenToParent = (
  parentNode: ITreeNode,
  children: Array<ITreeNode>
) => {
  return produce((draftState: ITreeReducerState) => {
    const matchNode = findNode(draftState.data, parentNode.referenceId);

    if (matchNode) {
      matchNode.children = children;
    }
  });
};

const updateSingleNode = (node: ITreeNode) => {
  return produce((draftState: ITreeReducerState) => {
    const matchNode = findNode(draftState.data, node.referenceId);
    Object.assign(matchNode, node);
  });
};

export {
  appendSingleNode,
  appendNodeChildrenToParent,
  findNode,
  getNearestParent,
  buildNodeTrail,
  updateSingleNode
};
