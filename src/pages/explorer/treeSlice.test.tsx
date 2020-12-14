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
import React from "react";
import treeReducer, {
  setCurrentNode,
  TreeState,
  isNodeInArray,
  findNodeInArray,
  isNodeInNode,
  findNodeInNode,
  cleanupToggledNodes,
  updateNode,
  applyNodeToArray,
  updateToggledNodes,
  initialState
} from "./treeSlice";
import { TreeNode, TreeNodeTypeEnum } from "../../api";

describe("treeReducer setCurrentNode", () => {
  const reducer = treeReducer;

  const node1: TreeNode = { referenceId: "referenceId1", name: "node1", type: TreeNodeTypeEnum.LABEL, children: [] };
  const node2: TreeNode = { referenceId: "referenceId2", name: "node2", type: TreeNodeTypeEnum.LABEL, children: [] };

  const emptyState = { currentNode: {} as TreeNode } as TreeState;

  it("with empty node {} and empty state", () => {
    const newState = reducer(initialState, setCurrentNode({} as TreeNode));
    expect(newState).toEqual(initialState);
  });

  it("with empty label node and empty state", () => {
    const newState = reducer(initialState, setCurrentNode({ type: TreeNodeTypeEnum.LABEL } as TreeNode));
    expect(newState).toEqual({
      ...initialState,
      currentNode: { type: TreeNodeTypeEnum.LABEL },
      toggledNodes: [{ type: TreeNodeTypeEnum.LABEL }]
    });
  });

  it("with empty node {} and state with node", () => {
    const newState = reducer({ currentNode: node1 } as TreeState, setCurrentNode({} as TreeNode));
    expect(newState).toEqual({ currentNode: {} });
  });

  it("with node and empty state", () => {
    const newState = reducer(initialState, setCurrentNode(node1));
    expect(newState).toEqual({ ...initialState, currentNode: node1, toggledNodes: [node1] });
  });

  it("with node and state with other node", () => {
    const newState = reducer({ ...initialState, currentNode: node1, toggledNodes: [node1] }, setCurrentNode(node2));
    expect(newState).toEqual({ ...initialState, currentNode: node2, toggledNodes: [node1, node2] });
  });
});
describe("treeReducer getRootNodesSuccess", () => {
  const reducer = treeReducer;

  const node1: TreeNode = { referenceId: "referenceId1", name: "node1", type: TreeNodeTypeEnum.LABEL, children: [] };
  const node2: TreeNode = { referenceId: "referenceId2", name: "node2", type: TreeNodeTypeEnum.LABEL, children: [] };
  const node3: TreeNode = { referenceId: "referenceId3", name: "node3", type: TreeNodeTypeEnum.LABEL, children: [] };
  const node4: TreeNode = { referenceId: "referenceId4", name: "node4", type: TreeNodeTypeEnum.LABEL, children: [] };

  it("with [] and empty nodes", () => {
    const newState = reducer(initialState, { type: "tree/getRootNodes/fulfilled", payload: [] as TreeNode[] });
    expect(newState).toEqual(initialState);
  });

  it("with empty node {} and empty nodes", () => {
    const expectedState = { ...initialState };
    expectedState.nodes = [{} as TreeNode];
    const newState = reducer(initialState, { type: "tree/getRootNodes/fulfilled", payload: [{}] as TreeNode[] });
    expect(newState).toEqual(expectedState);
  });

  it("with nodes and empty []", () => {
    const expectedState = { ...initialState };
    expectedState.nodes = [node1, node2];
    const newState = reducer(initialState, {
      type: "tree/getRootNodes/fulfilled",
      payload: [node1, node2] as TreeNode[]
    });
    expect(newState).toEqual(expectedState);
  });

  it("with nodes and other nodes and toggledNodes", () => {
    const firstState = { ...initialState };
    firstState.nodes = [node1, node2];
    firstState.toggledNodes = [node1, node2];
    const expectedState = { ...initialState };
    expectedState.nodes = [node3, node4];
    expectedState.toggledNodes = [];
    const newState = reducer(initialState, {
      type: "tree/getRootNodes/fulfilled",
      payload: [node3, node4] as TreeNode[]
    });
    expect(newState).toEqual(expectedState);
    expect(newState.toggledNodes).toEqual(expectedState.toggledNodes);
  });

  it("with nodes and other nodes and shared toggledNodes", () => {
    const firstState = { ...initialState };
    firstState.nodes = [node1, node2];
    firstState.toggledNodes = [node1, node2];
    const expectedState = { ...initialState };
    expectedState.nodes = [node2, node3];
    expectedState.toggledNodes = [node2];
    const newState = reducer(firstState, {
      type: "tree/getRootNodes/fulfilled",
      payload: [node2, node3] as TreeNode[]
    });
    expect(newState).toEqual(expectedState);
    expect(newState.toggledNodes).toEqual(expectedState.toggledNodes);
  });
});

describe("treeReducer getNodeSuccess", () => {
  const reducer = treeReducer;

  const node1: TreeNode = { referenceId: "referenceId1", name: "node1", type: TreeNodeTypeEnum.LABEL, children: [] };
  const node2: TreeNode = { referenceId: "referenceId2", name: "node2", type: TreeNodeTypeEnum.LABEL, children: [] };
  const node21: TreeNode = {
    referenceId: "referenceId21",
    name: "node21",
    parentLabelId: "referenceId2",
    type: TreeNodeTypeEnum.LABEL,
    children: []
  };
  const node5: TreeNode = {
    referenceId: "referenceId5",
    name: "node5",
    parentLabelId: "parentLabelId",
    type: TreeNodeTypeEnum.LABEL,
    children: []
  };

  const initialState = {
    toggledNodes: [] as TreeNode[],
    nodes: [] as TreeNode[],
    currentNode: undefined
  } as TreeState;

  it("with root node and nodes", () => {
    const firstState = { ...initialState };
    firstState.currentNode = node1;
    const expectedState = { ...initialState };
    expectedState.nodes = [node1];
    expectedState.currentNode = node1;
    const newState = reducer(firstState, { type: "tree/getNode/fulfilled", payload: node1 });
    expect(newState).toEqual(expectedState);
  });

  it("with root node changing and nodes", () => {
    const node1b: TreeNode = {
      referenceId: "referenceId1",
      name: "node1b",
      type: TreeNodeTypeEnum.LABEL,
      children: []
    };
    const firstState = { ...initialState };
    firstState.currentNode = node1;
    firstState.nodes = [node1];
    const expectedState = { ...initialState };
    expectedState.nodes = [node1b];
    expectedState.currentNode = node1b;
    const newState = reducer(firstState, { type: "tree/getNode/fulfilled", payload: node1b });
    expect(newState).toEqual(expectedState);
  });

  it("with node with parent not in roots", () => {
    const expectedState = { ...initialState };
    expectedState.nodes = [node1];
    const newState = reducer(expectedState, { type: "tree/getNode/fulfilled", payload: node5 });
    expect(newState).toEqual(expectedState);
  });

  it("with node in 2nd node", () => {
    const firstState = { ...initialState };
    firstState.nodes = [node1, node2];
    const node2expected: TreeNode = {
      referenceId: "referenceId2",
      name: "node2",
      hasChildren: true,
      children: [node21],
      type: TreeNodeTypeEnum.LABEL
    };
    const expectedState = { ...initialState };
    expectedState.nodes = [node1, node2expected];
    const newState = reducer(firstState, { type: "tree/getNode/fulfilled", payload: node21 });
    expect(newState).toEqual(expectedState);
  });

  it("with node in 2nd node and current node with ref id", () => {
    const firstState = { ...initialState };
    firstState.nodes = [node1, node2];
    firstState.currentNode = node21;
    const node2expected: TreeNode = {
      referenceId: "referenceId2",
      name: "node2",
      hasChildren: true,
      children: [node21],
      type: TreeNodeTypeEnum.LABEL
    };
    const expectedState = { ...initialState };
    expectedState.nodes = [node1, node2expected];
    expectedState.currentNode = node21;
    const newState = reducer(firstState, { type: "tree/getNode/fulfilled", payload: node21 });
    expect(newState).toEqual(expectedState);
  });

  it("with node in 2nd node and current node without ref id", () => {
    const node21b: TreeNode = {
      name: "node21",
      referenceId: "referenceId21",
      parentLabelId: "referenceId2",
      type: TreeNodeTypeEnum.LABEL,
      children: []
    };
    const firstState = { ...initialState };
    firstState.nodes = [node1, node2];
    firstState.currentNode = node21b;
    const node2expected: TreeNode = {
      referenceId: "referenceId2",
      name: "node2",
      hasChildren: true,
      children: [node21],
      type: TreeNodeTypeEnum.LABEL
    };
    const expectedState = { ...initialState };
    expectedState.nodes = [node1, node2expected];
    expectedState.currentNode = node21;
    const newState = reducer(firstState, { type: "tree/getNode/fulfilled", payload: node21 });
    expect(newState).toEqual(expectedState);
  });

  it("with nodes and other nodes and toggledNodes", () => {
    const node2b = node2;
    node2b.children = [node21];
    node2b.hasChildren = true;
    const firstState = { ...initialState };
    firstState.nodes = [node1, node2];
    firstState.toggledNodes = [node1, node2];
    const expectedState = { ...initialState };
    expectedState.nodes = [node1, node2b];
    expectedState.toggledNodes = [node1, node2];
    const newState = reducer(firstState, { type: "tree/getNode/fulfilled", payload: node2b });
    expect(newState).toEqual(expectedState);
    expect(newState.nodes).toEqual(expectedState.nodes);
  });
});

describe("test updateToggledNodes", () => {
  const reducer = treeReducer;
  const node11: TreeNode = {
    referenceId: "referenceId11",
    parentLabelId: "referenceId1",
    name: "node11",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node12: TreeNode = {
    referenceId: "referenceId12",
    parentLabelId: "referenceId1",
    name: "node12",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node21: TreeNode = {
    referenceId: "referenceId21",
    parentLabelId: "referenceId2",
    name: "node21",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  const node1: TreeNode = {
    referenceId: "referenceId1",
    name: "node1",
    hasChildren: true,
    children: [node11, node12],
    type: TreeNodeTypeEnum.LABEL
  };
  const node2: TreeNode = {
    referenceId: "referenceId2",
    name: "node2",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node4: TreeNode = {
    referenceId: "referenceId4",
    name: "node4",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  it("with empty togglednodes", () => {
    const expectedState = { ...initialState };
    expectedState.toggledNodes = [node1];
    const newState = reducer(initialState, updateToggledNodes(node1));
    expect(newState).toEqual(expectedState);
  });

  it("with 1 element", () => {
    const firstState = { ...initialState };
    firstState.toggledNodes = [node1];
    const newState = reducer(firstState, updateToggledNodes(node1));
    expect(newState.toggledNodes).toEqual([]);
  });
  it("with more elements, unselect", () => {
    const firstState = { ...initialState };
    firstState.toggledNodes = [node1, node2, node4];
    const newState = reducer(firstState, updateToggledNodes(node2));
    expect(newState.toggledNodes).toEqual([node1, node4]);
  });
  it("with more elements select", () => {
    const firstState = { ...initialState };
    firstState.toggledNodes = [node1, node2];
    const newState = reducer(firstState, updateToggledNodes(node4));
    expect(newState.toggledNodes).toEqual([node1, node2, node4]);
  });
});

describe("test applyNodeToArray", () => {
  const node11: TreeNode = {
    referenceId: "referenceId11",
    parentLabelId: "referenceId1",
    name: "node11",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node12: TreeNode = {
    referenceId: "referenceId12",
    parentLabelId: "referenceId1",
    name: "node12",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node21: TreeNode = {
    referenceId: "referenceId21",
    parentLabelId: "referenceId2",
    name: "node21",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  const node1: TreeNode = {
    referenceId: "referenceId1",
    name: "node1",
    hasChildren: true,
    children: [node11, node12],
    type: TreeNodeTypeEnum.LABEL
  };
  const node2: TreeNode = {
    referenceId: "referenceId2",
    name: "node2",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node4: TreeNode = {
    referenceId: "referenceId4",
    name: "node4",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node6: TreeNode = {
    name: "node6",
    referenceId: "referenceId6",
    parentLabelId: "parentLabelId",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  it("with empty nodes", () => {
    expect(applyNodeToArray([], node1)).toEqual([node1]);
  });
  it("with empty nodes and a parentLabelId", () => {
    expect(applyNodeToArray([], node6)).toEqual([]);
  });
  it("with nodes and a parentLabelId and node not in nodes", () => {
    expect(applyNodeToArray([node1, node2], node6)).toEqual([node1, node2]);
  });
  it("with 3th root node", () => {
    expect(applyNodeToArray([node1, node2], node4)).toEqual([node1, node2, node4]);
  });
  it("with node in 2nd root node", () => {
    const node2b = {
      referenceId: "referenceId2",
      name: "node2",
      hasChildren: true,
      children: [node21],
      type: TreeNodeTypeEnum.LABEL
    } as TreeNode;
    const array = applyNodeToArray([node1, node2], node21);
    expect(array).toEqual([node1, node2b]);
    expect(array[1].hasChildren).toEqual(true);
    expect(array[1].children[0]).toEqual(node21);
  });
});

describe("test updateNode", () => {
  const node11: TreeNode = {
    referenceId: "referenceId11",
    parentLabelId: "referenceId1",
    name: "node11",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node12: TreeNode = {
    referenceId: "referenceId12",
    parentLabelId: "referenceId1",
    name: "node12",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node13: TreeNode = {
    referenceId: "referenceId13",
    parentLabelId: "referenceId1",
    name: "node13",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node21: TreeNode = {
    referenceId: "referenceId21",
    parentLabelId: "referenceId2",
    name: "node21",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  const node1: TreeNode = {
    referenceId: "referenceId1",
    name: "node1",
    hasChildren: true,
    children: [node11, node12],
    type: TreeNodeTypeEnum.LABEL
  };
  const node2: TreeNode = {
    referenceId: "referenceId2",
    name: "node2",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  it("with node not in node", () => {
    expect(updateNode(node1, node2)).toEqual(node1);
  });
  it("with node id of root node", () => {
    const node1b = {
      referenceId: "referenceId1",
      name: "node1b",
      hasChildren: true,
      children: [node11, node12]
    } as TreeNode;
    const newNode = updateNode(node1, node1b);
    expect(newNode.name).toEqual(node1b.name);
  });
  it("with node equal to other node", () => {
    const node12b: TreeNode = {
      referenceId: "referenceId12",
      parentLabelId: "referenceId1",
      name: "node12b",
      hasChildren: false,
      children: [],
      type: TreeNodeTypeEnum.LABEL
    };
    const node1b = updateNode(node1, node12b);
    expect(node1b.children).toEqual([node11, node12b]);
  });
  it("with node new child of root node", () => {
    const node1b = {
      referenceId: "referenceId1",
      name: "node1",
      hasChildren: true,
      children: [node11, node12, node13],
      type: TreeNodeTypeEnum.LABEL
    };
    expect(updateNode(node1, node13)).toEqual(node1b);
  });
  it("with node new child of other node", () => {
    const node121: TreeNode = {
      referenceId: "referenceId121",
      parentLabelId: "referenceId12",
      name: "node121",
      hasChildren: false,
      children: [],
      type: TreeNodeTypeEnum.LABEL
    };
    const node12b: TreeNode = {
      referenceId: "referenceId12",
      parentLabelId: "referenceId1",
      name: "node12",
      hasChildren: true,
      children: [node121],
      type: TreeNodeTypeEnum.LABEL
    };
    const node1b = { ...node1, children: [node11, node12b] };
    const node1c = updateNode(node1, node121);
    const node12c = findNodeInNode(node1b, node12);
    expect(node12c.hasChildren).toBe(true);
    expect(node12c).toEqual(node12b);
  });
  it("with node new child of node on level 2", () => {
    const node1211: TreeNode = {
      referenceId: "referenceId1211",
      parentLabelId: "referenceId121",
      name: "node1211",
      hasChildren: false,
      children: [],
      type: TreeNodeTypeEnum.LABEL
    };
    const node121: TreeNode = {
      referenceId: "referenceId121",
      parentLabelId: "referenceId12",
      name: "node121",
      hasChildren: false,
      children: [],
      type: TreeNodeTypeEnum.LABEL
    };
    const node121expected: TreeNode = {
      referenceId: "referenceId121",
      parentLabelId: "referenceId12",
      name: "node121",
      hasChildren: true,
      children: [node1211],
      type: TreeNodeTypeEnum.LABEL
    };
    const node12b: TreeNode = {
      referenceId: "referenceId12",
      parentLabelId: "referenceId1",
      name: "node12",
      hasChildren: true,
      children: [node121],
      type: TreeNodeTypeEnum.LABEL
    };
    const node12expected: TreeNode = {
      referenceId: "referenceId12",
      parentLabelId: "referenceId1",
      name: "node12",
      hasChildren: true,
      children: [node121expected],
      type: TreeNodeTypeEnum.LABEL
    };
    const node1b = { ...node1, children: [node11, node12b] };
    const node1actual = updateNode(node1b, node1211);
    const node121actual = findNodeInNode(node1actual, node121);
    expect(node121actual.hasChildren).toBe(true);
    expect(node121actual).toEqual(node121expected);
  });
});

describe("test cleanupToggledNodes", () => {
  const node11: TreeNode = {
    referenceId: "referenceId11",
    name: "node11",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node12: TreeNode = {
    referenceId: "referenceId12",
    name: "node12",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  const node1: TreeNode = {
    referenceId: "referenceId1",
    name: "node1",
    hasChildren: true,
    children: [node11, node12],
    type: TreeNodeTypeEnum.LABEL
  };
  const node2: TreeNode = {
    referenceId: "referenceId2",
    name: "node2",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node4: TreeNode = {
    referenceId: "referenceId4",
    name: "node4",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node5: TreeNode = {
    referenceId: "referenceId5",
    name: "node5",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  const tree1 = [node1, node2];
  const toggleNodes1 = [node1, node2, node12, node4, node5];
  const toggleNodes2 = [node1, node2, node12];
  const toggleNodes3 = [node4, node5];

  it("with current in tree part of togglednodes", () => {
    const toggledNodes = cleanupToggledNodes([node1, node2, node12, node4, node5], [node1, node2]);
    expect(toggledNodes).toEqual([node1, node2, node12]);
  });
  it("with empty tree", () => {
    expect(cleanupToggledNodes([] as TreeNode[], toggleNodes1)).toEqual([]);
  });
  it("with all in tree", () => {
    expect(cleanupToggledNodes(toggleNodes2, tree1)).toEqual(toggleNodes2);
  });
  it("with nothing in tree", () => {
    expect(cleanupToggledNodes(toggleNodes3, tree1)).toEqual([]);
  });
  it("with empty toggled", () => {
    expect(cleanupToggledNodes([], tree1)).toEqual([]);
  });
});

describe("test isNodeInArray and findNodeInArray", () => {
  const node11: TreeNode = {
    referenceId: "referenceId11",
    name: "node11",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node12: TreeNode = {
    referenceId: "referenceId12",
    name: "node12",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  const node1: TreeNode = {
    referenceId: "referenceId1",
    name: "node1",
    hasChildren: true,
    children: [node11, node12],
    type: TreeNodeTypeEnum.LABEL
  };
  const node2: TreeNode = {
    referenceId: "referenceId2",
    name: "node2",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node3: TreeNode = {
    referenceId: "referenceId3",
    name: "node2",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node4: TreeNode = {
    referenceId: "referenceId4",
    name: "node4",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  const tree1 = [node1, node2];

  it("with is not in node node not empty tree", () => {
    expect(isNodeInArray(tree1, node4)).toEqual(false);
    expect(findNodeInArray(tree1, node4)).toEqual(undefined);
  });
  it("with is not in tree empty tree", () => {
    expect(isNodeInArray([] as TreeNode[], node2)).toEqual(false);
    expect(findNodeInArray([] as TreeNode[], node2)).toEqual(undefined);
  });
  it("with undefined node not empty tree", () => {
    expect(isNodeInArray(tree1, {} as TreeNode)).toEqual(false);
    expect(findNodeInArray(tree1, {} as TreeNode)).toEqual(undefined);
  });
  it("with is in tree", () => {
    expect(isNodeInArray(tree1, node12)).toEqual(true);
    expect(findNodeInArray(tree1, node12)).toEqual(node12);
  });
  it("with is in tree no parentLabelid", () => {
    expect(isNodeInArray(tree1, node2)).toEqual(true);
    expect(findNodeInArray(tree1, node2)).toEqual(node2);
  });

  it("with no referenceId", () => {
    expect(isNodeInArray(tree1, node3)).toEqual(false);
    expect(findNodeInArray(tree1, node3)).toEqual(undefined);
  });
});

describe("test isNodeInNode and findNodeInNode", () => {
  const node11: TreeNode = {
    referenceId: "referenceId11",
    name: "node11",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node12: TreeNode = {
    referenceId: "referenceId12",
    name: "node12",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };

  const node1: TreeNode = {
    referenceId: "referenceId1",
    name: "node1",
    hasChildren: true,
    children: [node11, node12],
    type: TreeNodeTypeEnum.LABEL
  };
  const node2: TreeNode = {
    referenceId: "referenceId2",
    name: "node2",
    hasChildren: false,
    children: [],
    type: TreeNodeTypeEnum.LABEL
  };
  const node3: TreeNode = { name: "node2", hasChildren: false, children: [], type: TreeNodeTypeEnum.LABEL };

  it("with is not in node node not empty tree", () => {
    expect(isNodeInNode(node1, node2)).toEqual(false);
    expect(findNodeInNode(node1, node2)).toEqual(undefined);
  });
  it("with is not in node node empty tree", () => {
    expect(isNodeInNode({} as TreeNode, node2)).toEqual(false);
    expect(findNodeInNode({} as TreeNode, node2)).toEqual(undefined);
  });
  it("with undefined node not empty tree", () => {
    expect(isNodeInNode(node1, {} as TreeNode)).toEqual(false);
    expect(findNodeInNode(node1, {} as TreeNode)).toEqual(undefined);
  });
  it("with is in node", () => {
    expect(isNodeInNode(node1, node12)).toEqual(true);
    expect(findNodeInNode(node1, node12)).toEqual(node12);
  });
  it("with is in node no parentLabelid", () => {
    expect(isNodeInNode(node1, node1)).toEqual(true);
    expect(findNodeInNode(node1, node1)).toEqual(node1);
  });

  it("with no referenceId", () => {
    expect(isNodeInNode(node1, node3)).toEqual(false);
    expect(findNodeInNode(node1, node3)).toEqual(undefined);
  });
});
