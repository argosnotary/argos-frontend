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
import React, { ReactNode } from "react";
import ITreeNode from "../interfaces/ITreeNode";
import {
  HierarchyEditorPanelModes,
  HierarchyEditorPanelTypes,
  HierarchyEditorStateContext
} from "../stores/hierarchyEditorStore";
import { FormPermissions } from "../types/FormPermission";
import { ITreeReducerState } from "../stores/treeEditorStore";
import { ThemeProvider } from "styled-components";
import theme from "../theme/base.json";

interface IHierarchyEditorTestWrapperProps {
  children: ReactNode;
  mockedDispatch: () => void;
}

const HierarchyEditorTestWrapper: React.FC<IHierarchyEditorTestWrapperProps> = ({
  children,
  mockedDispatch
}) => {
  const node: ITreeNode = {
    name: "layout",
    parentId: "",
    referenceId: "supplyChainId",
    hasChildren: false,
    type: "SUPPLY_CHAIN"
  };

  const state = {
    editor: {
      breadcrumb: "label / ",
      mode: HierarchyEditorPanelModes.DEFAULT,
      panel: HierarchyEditorPanelTypes.EXECUTE_APPROVAL,
      node,
      permission: FormPermissions.EDIT
    },
    tree: {} as ITreeReducerState
  };

  return (
    <ThemeProvider theme={theme}>
      <HierarchyEditorStateContext.Provider
        value={[
          state,
          {
            editor: mockedDispatch,
            tree: () => {
              return;
            }
          }
        ]}>
        {children}
      </HierarchyEditorStateContext.Provider>
    </ThemeProvider>
  );
};

export default HierarchyEditorTestWrapper;
