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
import ILabelPostResponse from "../interfaces/ILabelPostResponse";

interface ILayoutEditorState {
  nodeParentId: string;
  nodeReferenceId: string;
  firstPanelView: string;
  breadcrumb: string;
  selectedNodeName: string;
  data?: any;
  dataAction?: string;
}

export enum LayoutEditorActionTypes {
  NONE = "",
  POSTNEWLABEL = "postnewlabel",
  PUTLABEL = "putlabel",
  ADDLABEL = "addlabel",
  UPDATELABEL = "updatelabel",
  RESETPANE = "resetpane"
}

export type LayoutEditorAction =
  | {
      type: LayoutEditorActionTypes.ADDLABEL;
      nodeReferenceId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | {
      type: LayoutEditorActionTypes.UPDATELABEL;
      nodeReferenceId: string;
      nodeParentId: string;
      breadcrumb: string;
      selectedNodeName: string;
    }
  | { type: LayoutEditorActionTypes.RESETPANE }
  | { type: LayoutEditorActionTypes.POSTNEWLABEL; label: ILabelPostResponse }
  | { type: LayoutEditorActionTypes.PUTLABEL; label: ILabelPostResponse };

const editorReducer = (
  state: ILayoutEditorState,
  action: LayoutEditorAction
) => {
  switch (action.type) {
    case LayoutEditorActionTypes.ADDLABEL:
      return {
        ...state,
        firstPanelView: LayoutEditorActionTypes.ADDLABEL,
        nodeReferenceId: action.nodeReferenceId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case LayoutEditorActionTypes.UPDATELABEL:
      return {
        ...state,
        firstPanelView: LayoutEditorActionTypes.UPDATELABEL,
        nodeReferenceId: action.nodeReferenceId,
        nodeParentId: action.nodeParentId,
        breadcrumb: action.breadcrumb,
        selectedNodeName: action.selectedNodeName
      };
    case LayoutEditorActionTypes.RESETPANE:
      return {
        ...state,
        firstPanelView: "",
        nodeReferenceId: "",
        dataAction: ""
      };
    case LayoutEditorActionTypes.POSTNEWLABEL:
      return {
        ...state,
        dataAction: LayoutEditorActionTypes.POSTNEWLABEL,
        data: action.label
      };
    case LayoutEditorActionTypes.PUTLABEL: {
      return {
        ...state,
        dataAction: LayoutEditorActionTypes.PUTLABEL,
        data: action.label
      };
    }
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
