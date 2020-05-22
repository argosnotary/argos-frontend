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
import React, { useReducer } from "react";

import TreeEditor from "./TreeEditor";

import json from "./sampleData.json";
import { treeReducer, initialTreeState } from "../../stores/treeEditorStore";

import ApproveIcon from "../../atoms/Icons/ApproveIcon";

export default {
  title: "TreeEditor"
};

const treeStringList = {
  createrootnode: "Create base label..."
};

const treeClickHandlers = [
  {
    type: "LABEL",
    callback: () => {
      alert("click");
    }
  }
];

const treeContextMenu = [
  {
    type: "LABEL",
    menuitems: [
      {
        label: "Add label",
        visible: () => true,
        callback: () => {
          alert("adding child label");
        }
      }
    ]
  },
  {
    type: "SUPPLY_CHAIN",
    menuitems: [
      {
        label: "Approve step",
        icon: <ApproveIcon size={16} color={"gray"} />,
        visible: () => true,
        callback: () => {
          alert("adding child label");
        }
      },
      {
        label: "Gerard",
        visible: () => true,
        callback: () => {
          alert("adding child label");
        }
      }
    ]
  }
];

const cbCreateRootNode = () => {
  alert("root node callback");
};

const cbGetNodeChildren = () => {
  alert("get node children callback");
};

const DummyParent = () => {
  const [treeState, treeDispatch] = useReducer(treeReducer, initialTreeState);

  const treeContext = {
    treeState,
    treeDispatch,
    treeStringList,
    treeContextMenu,
    treeClickHandlers,
    canCreateRootNode: () => true,
    cbCreateRootNode,
    cbGetNodeChildren,
    isLoading: false,
    selectedNodeReferenceId: ""
  };

  return (
    <TreeEditor data={json.sampleData} loading={false} context={treeContext} />
  );
};

export const editor = () => <DummyParent />;
