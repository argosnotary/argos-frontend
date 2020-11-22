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
import React, { useReducer } from "react";
import { mount } from "enzyme";

import TreeEditor, {
  AddAdditionalRootNodes,
  ParentNode,
  TreeHead,
  NodeContextMenuContainer,
  NodeContextMenuItem
} from "./TreeEditor";
import { ThemeProvider } from "styled-components";
import theme from "../../theme/base.json";
import json from "./sampleData.json";
import {
  treeReducer,
  initialTreeState,
  ITreeStateContext
} from "../../stores/treeEditorStore";
import { TreeHeadLabelSpan } from "./TreeHeadLabel";
import ITreeContextMenuEntry from "../../interfaces/ITreeContextMenuEntry";

const treeStringList = {
  createrootnode: "Create base label..."
};

const treeClickHandlers = [
  {
    type: "LABEL",
    callback: jest.fn()
  }
];

const visibleFunction = jest.fn();
const invisibleFunction = jest.fn();
visibleFunction.mockReturnValue(true);
invisibleFunction.mockReturnValue(false);

const treeContextMenu: Array<ITreeContextMenuEntry> = [
  {
    type: "LABEL",
    menuitems: [
      {
        label: "Add child label",
        callback: jest.fn(),
        visible: visibleFunction
      },
      {
        label: "invisible",
        callback: jest.fn(),
        visible: invisibleFunction
      }
    ]
  }
];

const cbCreateRootNode = jest.fn();

const cbGetNodeChildren = jest.fn();

const canCreateRootNode = jest.fn();

canCreateRootNode.mockReturnValue(true);

const DummyParent = () => {
  const [treeState, treeDispatch] = useReducer(treeReducer, initialTreeState);

  const treeContext: ITreeStateContext = {
    treeState,
    treeDispatch,
    treeStringList,
    treeContextMenu,
    treeClickHandlers,
    cbCreateRootNode,
    canCreateRootNode,
    cbGetNodeChildren,
    isLoading: false,
    selectedNodeReferenceId: ""
  };

  return (
    <TreeEditor data={json.sampleData} loading={false} context={treeContext} />
  );
};

describe("TreeEditor", () => {
  const root = mount(
    <ThemeProvider theme={theme}>
      <DummyParent />
    </ThemeProvider>
  );

  it("renders initial data correctly", () => {
    expect(root.find(TreeEditor)).toMatchSnapshot();
  });

  it("renders initial data correctly without add base label", () => {
    canCreateRootNode.mockReturnValue(false);
    const rootWithoutAddBaseLabel = mount(
      <ThemeProvider theme={theme}>
        <DummyParent />
      </ThemeProvider>
    );
    expect(rootWithoutAddBaseLabel.find(TreeEditor)).toMatchSnapshot();
  });

  it("displays create root node button with correct text", () => {
    const element = root.find(AddAdditionalRootNodes);
    const label = element.find(TreeHeadLabelSpan);
    expect(label.text()).toEqual("Create base label...");
  });

  it("onClick create root node button, cbCreateRootNode has to be called", () => {
    const label = root.find(AddAdditionalRootNodes).find(TreeHeadLabelSpan);
    label.simulate("click");

    expect(cbCreateRootNode).toHaveBeenCalled();
  });

  it("onClick node who has children, while no children are loaded, cbGetNodeChildren has to be called", () => {
    const node = root
      .find(ParentNode)
      .at(2)
      .find(TreeHead);

    node.simulate("click");

    expect(cbGetNodeChildren).toHaveBeenCalled();
  });

  it("onContextMenu node with context options, contextmenu must be rendered", () => {
    visibleFunction.mockReturnValueOnce(true);
    const node = root
      .find(ParentNode)
      .at(2)
      .find(TreeHeadLabelSpan);

    node.simulate("contextmenu");

    const contextMenu = root.find(NodeContextMenuContainer);
    expect(contextMenu).toMatchSnapshot();
  });

  it("onClick contextmenu item, correct callback must be called", () => {
    const node = root
      .find(ParentNode)
      .at(2)
      .find(TreeHeadLabelSpan);

    node.simulate("contextmenu");

    const contextMenu = root.find(NodeContextMenuContainer);
    const menuItem = contextMenu.find(NodeContextMenuItem);

    menuItem.simulate("click");

    expect(treeContextMenu[0].menuitems[0].callback).toHaveBeenCalled();
  });

  it("onClick node, correct callback must be called", () => {
    const node = root
      .find(ParentNode)
      .at(2)
      .find(TreeHeadLabelSpan);

    node.simulate("click");

    expect(treeClickHandlers[0].callback).toHaveBeenCalled();
  });
});
