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
import React, { Dispatch, useContext, useReducer } from "react";
import {
  ILayout,
  ILayoutSegment,
  ILayoutValidationMessage,
  IStep
} from "../../../../interfaces/ILayout";

export enum DetailsPanelType {
  EMPTY,
  VALIDATION_ERRORS,
  STEP_DETAILS
}

interface ILayoutEditorState {
  activeEditLayoutElement: IStep | ILayoutSegment | undefined;
  selectedLayoutElement: IStep | ILayoutSegment | undefined;
  layout: ILayout;
  validationErrors?: Array<ILayoutValidationMessage>;
  loading: boolean;
  showSigningDialog: boolean;
  detailPanelMode: DetailsPanelType;
}

interface ILayoutEditorStoreContext {
  state: ILayoutEditorState;
  dispatch: Dispatch<ILayoutEditorAction>;
}

export const LayoutEditorStoreContext = React.createContext<
  ILayoutEditorStoreContext
>({} as ILayoutEditorStoreContext);

export enum LayoutEditorActionType {
  START_LOADING,
  END_LOADING,
  UPDATE_LAYOUT,
  EDIT_LAYOUT_ELEMENT,
  DEACTIVATE_LAYOUT_ELEMENT,
  ADD_SEGMENT,
  UPDATE_NAME_ACTIVATE_LAYOUT_ELEMENT,
  DELETE_SEGMENT,
  LAYOUT_HAS_VALIDATION_ERRORS,
  START_SIGNING,
  STOP_SIGNING,
  SELECT_LAYOUT_ELEMENT,
  ADD_STEP,
  DELETE_STEP
}

export interface ILayoutEditorAction {
  type: LayoutEditorActionType;
  layoutElement?: IStep | ILayoutSegment;
  layout?: ILayout;
  layoutElementName?: string;
  validationErrors?: Array<ILayoutValidationMessage>;
}

const determinePanelMode = (
  layoutElement?: IStep | ILayoutSegment
): DetailsPanelType => {
  return layoutElement
    ? (layoutElement as ILayoutSegment).steps
      ? DetailsPanelType.EMPTY
      : DetailsPanelType.STEP_DETAILS
    : DetailsPanelType.EMPTY;
};

const reducer = (
  state: ILayoutEditorState,
  action: ILayoutEditorAction
): ILayoutEditorState => {
  switch (action.type) {
    case LayoutEditorActionType.START_LOADING:
      return { ...state, loading: true };
    case LayoutEditorActionType.END_LOADING:
      return { ...state, loading: false };
    case LayoutEditorActionType.UPDATE_LAYOUT:
      if (action.layout) {
        return { ...state, layout: action.layout };
      }
      return { ...state };
    case LayoutEditorActionType.EDIT_LAYOUT_ELEMENT:
      return { ...state, activeEditLayoutElement: action.layoutElement };
    case LayoutEditorActionType.SELECT_LAYOUT_ELEMENT:
      return {
        ...state,
        selectedLayoutElement: action.layoutElement,
        detailPanelMode: determinePanelMode(action.layoutElement)
      };
    case LayoutEditorActionType.DEACTIVATE_LAYOUT_ELEMENT:
      return {
        ...state,
        activeEditLayoutElement: undefined,
        detailPanelMode: DetailsPanelType.EMPTY
      };
    case LayoutEditorActionType.ADD_SEGMENT:
      if (action.layoutElement) {
        if (state.layout.layoutSegments === undefined) {
          state.layout.layoutSegments = [];
        }
        state.layout.layoutSegments.push(
          action.layoutElement as ILayoutSegment
        );
        return {
          ...state,
          layout: { ...state.layout },
          activeEditLayoutElement: action.layoutElement
        };
      }
      return { ...state };
    case LayoutEditorActionType.UPDATE_NAME_ACTIVATE_LAYOUT_ELEMENT:
      if (action.layoutElementName && state.activeEditLayoutElement) {
        state.activeEditLayoutElement.name = action.layoutElementName;
        return {
          ...state,
          activeEditLayoutElement: undefined,
          selectedLayoutElement: state.activeEditLayoutElement,
          layout: { ...state.layout },
          detailPanelMode: determinePanelMode(state.activeEditLayoutElement)
        };
      }
      return { ...state };
    case LayoutEditorActionType.DELETE_SEGMENT:
      if (action.layoutElement) {
        const segmentIndex = state.layout.layoutSegments.indexOf(
          action.layoutElement as ILayoutSegment
        );
        if (segmentIndex >= 0) {
          state.layout.layoutSegments.splice(segmentIndex, 1);
        }
        return {
          ...state,
          layout: { ...state.layout },
          selectedLayoutElement: undefined,
          activeEditLayoutElement: undefined,
          detailPanelMode: DetailsPanelType.EMPTY
        };
      }
      return { ...state };
    case LayoutEditorActionType.LAYOUT_HAS_VALIDATION_ERRORS:
      if (action.validationErrors) {
        return {
          ...state,
          validationErrors: action.validationErrors,
          detailPanelMode: DetailsPanelType.VALIDATION_ERRORS
        };
      }
      return { ...state };
    case LayoutEditorActionType.ADD_STEP:
      if (action.layoutElement && state.selectedLayoutElement) {
        (state.selectedLayoutElement as ILayoutSegment).steps.push(
          action.layoutElement as IStep
        );
        return { ...state, layout: { ...state.layout } };
      }
      return { ...state };
    case LayoutEditorActionType.DELETE_STEP:
      if (action.layoutElement && state.selectedLayoutElement) {
        const stepIndex = (state.selectedLayoutElement as ILayoutSegment).steps.indexOf(
          action.layoutElement as IStep
        );
        if (stepIndex >= 0) {
          (state.selectedLayoutElement as ILayoutSegment).steps.splice(
            stepIndex,
            1
          );
        }
        return {
          ...state,
          layout: { ...state.layout },
          selectedLayoutElement: undefined,
          activeEditLayoutElement: undefined,
          detailPanelMode: DetailsPanelType.EMPTY
        };
      }
      return { ...state };
    case LayoutEditorActionType.START_SIGNING:
      return { ...state, showSigningDialog: true };
    case LayoutEditorActionType.STOP_SIGNING:
      return { ...state, showSigningDialog: false };
    default:
      throw new Error();
  }
};

export const createLayoutEditorStoreContext = (): ILayoutEditorStoreContext => {
  const [state, dispatch] = useReducer(reducer, {
    layout: {} as ILayout,
    activeEditLayoutElement: undefined,
    selectedLayoutElement: undefined,
    loading: false,
    showSigningDialog: false,
    detailPanelMode: DetailsPanelType.EMPTY
  });
  return { state: state, dispatch: dispatch };
};

export const useLayoutEditorStore = () => useContext(LayoutEditorStoreContext);
