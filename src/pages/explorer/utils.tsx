/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { TreeNode } from "../../api";

const findNode = (nodes: Array<TreeNode>, id: string): TreeNode | undefined => {
  if (nodes.length == 0) return;

  return (
    nodes.find(n => n.referenceId === id) ||
    findNode(
      nodes.flatMap(n => n.children || []),
      id
    )
  );
};

const getParent = (node: TreeNode, nodes: Array<TreeNode>): TreeNode | undefined => {
  if (nodes) {
    nodes.forEach(theNode => {
      if (theNode.referenceId === node.referenceId) {
        return undefined;
      }
      if (theNode.hasChildren) {
        theNode.children.forEach(child => {
          if (node.referenceId === child.referenceId) {
            return theNode;
          } else {
            const res = getParent(node, child.children);
            if (res) {
              return res;
            } else {
              return undefined;
            }
          }
        });
      }
      return undefined;
    });
  }
  return undefined;
};

const buildNodeTrail = (trail: Array<TreeNode>, nodes: Array<TreeNode>, node: TreeNode): Array<TreeNode> => {
  const res = getParent(node, nodes);
  if (res) {
    trail.push(res);
    return buildNodeTrail(trail, nodes, res);
  }
  return trail.reverse();
};

const addChild = (parent: TreeNode, child: TreeNode) => {
  if (parent.hasChildren) {
    parent.children.push(child);
  } else {
    parent.children = [child];
  }
};

export { findNode, getParent, buildNodeTrail };
