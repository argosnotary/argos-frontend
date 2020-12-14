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
import { isLogoutAction } from "./../user/tokenSlice";
import { HierarchyApi, TreeNode, HierarchyMode, TreeNodeTypeEnum } from "./../../api/api";
import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getApiConfig } from "../../api/apiConfig";

export interface TreeState {
  toggledNodes: TreeNode[];
  nodes: TreeNode[];
  currentNode: TreeNode | undefined;
}

export const getRootNodes: any = createAsyncThunk("tree/getRootNodes", async (_, thunkAPI: any) => {
  const api = new HierarchyApi(getApiConfig(thunkAPI.getState().token.token));
  try {
    const response = await api.getRootNodes();
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 404) {
      return thunkAPI.rejectWithValue(error.response.message);
    } else {
      return thunkAPI.rejectWithValue("unknown");
    }
  }
});

export const getNodeChildren: any = createAsyncThunk(
  "tree/getNodeChildren",
  async (parent: TreeNode, thunkAPI: any) => {
    const api = new HierarchyApi(getApiConfig(thunkAPI.getState().token.token));
    try {
      const response = await api.getSubTree(parent.referenceId, HierarchyMode.MAX_DEPTH);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status !== 404) {
        return thunkAPI.rejectWithValue(error.response.message);
      } else {
        return thunkAPI.rejectWithValue("unknown");
      }
    }
  }
);

export const getNode: any = createAsyncThunk("tree/getNode", async (node: TreeNode, thunkAPI: any) => {
  const api = new HierarchyApi(getApiConfig(thunkAPI.getState().token.token));
  try {
    const response = await api.getSubTree(node.referenceId, HierarchyMode.NONE);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 404) {
      return thunkAPI.rejectWithValue(error.response.message);
    } else {
      return thunkAPI.rejectWithValue("unknown");
    }
  }
});

export const initialState = {
  toggledNodes: [] as TreeNode[],
  nodes: [] as TreeNode[],
  currentNode: {} as TreeNode
} as TreeState;

export function isSetCurrentNodeAction(action: AnyAction): boolean {
  return action.type === "tree/setCurrentNode";
}

function treeNodeSort(nodes: TreeNode[]) {
  return [...nodes].sort(function (a: TreeNode, b: TreeNode) {
    return a.name.localeCompare(b.name);
  });
}

const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setCurrentNode(state, action: PayloadAction<TreeNode>) {
      state.currentNode = action.payload;
      if (state.currentNode.type && state.currentNode.type === TreeNodeTypeEnum.LABEL) {
        if (
          state.currentNode.type &&
          state.currentNode.type === TreeNodeTypeEnum.LABEL &&
          !state.toggledNodes.find(node => node.referenceId === action.payload.referenceId)
        ) {
          state.toggledNodes = [...state.toggledNodes, action.payload];
        }
      }
      return state;
    },
    updateToggledNodes(state, action: PayloadAction<TreeNode>) {
      if (state.toggledNodes.find(node => node.referenceId === action.payload.referenceId)) {
        state.toggledNodes = state.toggledNodes.filter(node => node.referenceId !== action.payload.referenceId);
      } else {
        state.toggledNodes = [...state.toggledNodes, action.payload];
      }
      return state;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getRootNodes.fulfilled, (state, action) => {
        const nodes = treeNodeSort(action.payload);
        const toggledNodes = cleanupToggledNodes(state.toggledNodes, action.payload);
        return { ...state, nodes, toggledNodes };
      })
      .addCase(getNodeChildren.fulfilled, (state, action) => {
        state.nodes = applyNodeToArray(state.nodes, action.payload);
        state.currentNode =
          state.currentNode &&
          (!state.currentNode.referenceId || state.currentNode.referenceId === action.payload.referenceId) &&
          isNodeInArray(state.nodes, action.payload)
            ? action.payload
            : state.currentNode;
        return state;
      })
      .addCase(getNode.fulfilled, (state, action) => {
        const nodes = applyNodeToArray(state.nodes, action.payload);
        const toggledNodes = cleanupToggledNodes(state.toggledNodes, nodes);
        const currentNode =
          state.currentNode &&
          (!state.currentNode.referenceId || state.currentNode.referenceId === action.payload.referenceId) &&
          isNodeInArray(state.nodes, action.payload)
            ? action.payload
            : state.currentNode;
        return { ...state, nodes, currentNode, toggledNodes };
      })
      .addMatcher(isLogoutAction, () => {
        return initialState;
      });
  }
});

export const { setCurrentNode, updateToggledNodes } = treeSlice.actions;

export default treeSlice.reducer;

export function applyNodeToArray(nodes: TreeNode[], node: TreeNode): TreeNode[] {
  if (!node.parentLabelId) {
    if (!isNodeInArray(nodes, node)) {
      return treeNodeSort([...nodes, node]);
    } else {
      return treeNodeSort(nodes.map(n => (n.referenceId === node.referenceId ? node : n)));
    }
  }
  for (const rootNode of nodes) {
    const parentNode = { referenceId: node.parentLabelId } as TreeNode;
    if (isNodeInNode(rootNode, parentNode)) {
      const newNode = updateNode(rootNode, node);
      return treeNodeSort(nodes.map(n => (n.referenceId !== newNode.referenceId ? n : newNode)));
    }
  }
  return treeNodeSort(nodes);
}

export function updateNode(rootNode: TreeNode, node: TreeNode): TreeNode {
  if (rootNode.referenceId === node.referenceId) {
    return { ...node };
  }
  if (rootNode.referenceId === node.parentLabelId) {
    for (const child of rootNode.children) {
      if (child.referenceId === node.referenceId) {
        // one of the children is updated
        return {
          ...rootNode,
          children: treeNodeSort([...rootNode.children.map(n => (n.referenceId !== node.referenceId ? n : node))])
        };
      }
    }
    // a new child of root
    return { ...rootNode, children: treeNodeSort([...rootNode.children, node]), hasChildren: true };
  } else {
    const parentNode = { referenceId: node.parentLabelId } as TreeNode;
    for (const child of rootNode.children) {
      if (isNodeInNode(child, parentNode)) {
        // the node is in one of the children
        return {
          ...rootNode,
          children: treeNodeSort([
            ...rootNode.children.map(n => (n.referenceId !== child.referenceId ? n : updateNode(child, node)))
          ])
        };
      }
    }
  }
  // the node is not found
  return rootNode;
}

export function cleanupToggledNodes(toggledNodes: TreeNode[], nodes: TreeNode[]): TreeNode[] {
  const currentToggledNodes: TreeNode[] = toggledNodes.filter(node => isNodeInArray(nodes, node));
  return currentToggledNodes ? currentToggledNodes : ([] as TreeNode[]);
}

export function isNodeInNode(root: TreeNode, node: TreeNode): boolean {
  if (!root || !node) {
    return false;
  } else {
    if (root.referenceId === node.referenceId) {
      return true;
    } else {
      if (root.hasChildren && root.children.length > 0) {
        for (const child of root.children) {
          const found = isNodeInNode(child, node);
          if (found) {
            return found;
          }
        }
      }
    }
  }
  return false;
}

export function isNodeInArray(nodes: TreeNode[], node: TreeNode): boolean {
  if (!nodes || !(nodes.length > 0) || !node) {
    return false;
  } else {
    for (const n of nodes) {
      const found = isNodeInNode(n, node);
      if (found) {
        return found;
      }
    }
  }
  return false;
}

export const findNodeInArray = (nodes: Array<TreeNode>, node: TreeNode): TreeNode | undefined => {
  if (!nodes || !(nodes.length > 0) || !node || !node.referenceId) {
    return;
  } else {
    for (const n of nodes) {
      const foundNode = findNodeInNode(n, node);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return;
};

export function findNodeInNode(root: TreeNode, node: TreeNode): TreeNode | undefined {
  if (!root || !node) {
    return;
  } else {
    if (root.referenceId === node.referenceId) {
      return root;
    } else {
      if (root.hasChildren && root.children.length > 0) {
        for (const child of root.children) {
          const foundNode = findNodeInNode(child, node);
          if (foundNode) {
            return foundNode;
          }
        }
      }
    }
  }
  return;
}
