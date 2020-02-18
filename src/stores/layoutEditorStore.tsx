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
import React, { Dispatch } from "react";

interface ILayoutEditorState {
  nodeReferenceId?: string;
  firstPanelView: string;
  breadcrumb: string;
  selectedNodeName: string;
}

export type LayoutEditorAction =
  | {
      type: "addlabel";
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | { type: "resetpane" };

const editorReducer = (
  state: ILayoutEditorState,
  action: LayoutEditorAction
) => {
  switch (action.type) {
    case "addlabel":
      return {
        ...state,
        firstPanelView: "addlabel",
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case "resetpane":
      return {
        ...state,
        firstPanelView: "",
        nodeReferenceId: ""
      };
  }
};

interface IContextProps {
  state: ILayoutEditorState;
  dispatch: Dispatch<LayoutEditorAction>;
}

const StateContext = React.createContext<
  [ILayoutEditorState, Dispatch<LayoutEditorAction>]
>([
  {} as ILayoutEditorState,
  () => {
    return;
  }
]);

export { editorReducer, StateContext };
