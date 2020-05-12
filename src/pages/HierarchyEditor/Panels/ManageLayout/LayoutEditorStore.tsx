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
import {
  IApprovalConfig,
  IArtifactCollector
} from "../../../../interfaces/IApprovalConfig";

export enum DetailsPanelType {
  EMPTY,
  VALIDATION_ERRORS,
  STEP_DETAILS
}

interface ILayoutElement {
  segment?: ILayoutSegment;
  step?: IStep;
  approvalConfig?: IApprovalConfig;
}

interface ILayoutEditorState {
  activeEditLayoutElement: ILayoutElement | undefined;
  selectedLayoutElement: ILayoutElement | undefined;
  layout: ILayout;
  validationErrors?: Array<ILayoutValidationMessage>;
  loading: boolean;
  showSigningDialog: boolean;
  detailPanelMode: DetailsPanelType;
  approvalConfigs: Array<IApprovalConfig>;
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
  SELECT_STEP,
  ADD_STEP,
  DELETE_STEP,
  UPDATE_APPROVAL_CONFIGS,
  UPDATE_ARTIFACT_COLLECTOR,
  ADD_ARTIFACT_COLLECTOR,
  DELETE_ARTIFACT_COLLECTOR
}

export interface ILayoutEditorAction {
  type: LayoutEditorActionType;
  layoutStep?: IStep;
  layoutSegment?: ILayoutSegment;
  layout?: ILayout;
  layoutElementName?: string;
  validationErrors?: Array<ILayoutValidationMessage>;
  approvalConfigs?: Array<IApprovalConfig>;
  artifactCollector?: IArtifactCollector;
}

const createSelectedLayoutElement = (
  state: ILayoutEditorState,
  action: ILayoutEditorAction
): ILayoutElement => {
  return {
    segment: action.layoutSegment,
    step: action.layoutStep,
    approvalConfig:
      action.layoutSegment && action.layoutStep
        ? state.approvalConfigs.find(config => {
            return (
              config.stepName === action.layoutStep?.name &&
              config.segmentName === action.layoutSegment?.name
            );
          })
        : undefined
  };
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
        return {
          ...state,
          layout: action.layout,
          selectedLayoutElement: undefined,
          activeEditLayoutElement: undefined,
          showSigningDialog: false,
          detailPanelMode: DetailsPanelType.EMPTY,
          validationErrors: undefined
        };
      }
      return { ...state };
    case LayoutEditorActionType.EDIT_LAYOUT_ELEMENT:
      return {
        ...state,
        activeEditLayoutElement: createSelectedLayoutElement(state, action)
      };
    case LayoutEditorActionType.SELECT_STEP:
      return {
        ...state,
        selectedLayoutElement: createSelectedLayoutElement(state, action),
        detailPanelMode: DetailsPanelType.STEP_DETAILS
      };
    case LayoutEditorActionType.DEACTIVATE_LAYOUT_ELEMENT:
      return {
        ...state,
        activeEditLayoutElement: undefined,
        detailPanelMode: DetailsPanelType.EMPTY
      };
    case LayoutEditorActionType.ADD_SEGMENT:
      if (action.layoutSegment) {
        if (state.layout.layoutSegments === undefined) {
          state.layout.layoutSegments = [];
        }
        state.layout.layoutSegments.push(action.layoutSegment);
        return {
          ...state,
          layout: { ...state.layout },
          activeEditLayoutElement: createSelectedLayoutElement(state, action)
        };
      }
      return { ...state };
    case LayoutEditorActionType.UPDATE_NAME_ACTIVATE_LAYOUT_ELEMENT:
      if (action.layoutElementName && state.activeEditLayoutElement) {
        if (state.activeEditLayoutElement.step) {
          state.activeEditLayoutElement.step.name = action.layoutElementName;
        } else if (state.activeEditLayoutElement.segment) {
          state.activeEditLayoutElement.segment.name = action.layoutElementName;
        }
        return {
          ...state,
          activeEditLayoutElement: undefined,
          selectedLayoutElement: state.activeEditLayoutElement,
          layout: { ...state.layout },
          detailPanelMode: state.activeEditLayoutElement.step
            ? DetailsPanelType.STEP_DETAILS
            : DetailsPanelType.EMPTY
        };
      }
      return { ...state };
    case LayoutEditorActionType.DELETE_SEGMENT:
      if (action.layoutSegment) {
        const segmentIndex = state.layout.layoutSegments.indexOf(
          action.layoutSegment
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
      if (action.layoutSegment && action.layoutStep) {
        action.layoutSegment.steps.push(action.layoutStep);
        return { ...state, layout: { ...state.layout } };
      }
      return { ...state };
    case LayoutEditorActionType.DELETE_STEP:
      if (action.layoutSegment && action.layoutStep) {
        const stepIndex = action.layoutSegment.steps.indexOf(action.layoutStep);
        if (stepIndex >= 0) {
          action.layoutSegment.steps.splice(stepIndex, 1);
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
    case LayoutEditorActionType.UPDATE_APPROVAL_CONFIGS:
      return { ...state, approvalConfigs: action.approvalConfigs || [] };
    case LayoutEditorActionType.UPDATE_ARTIFACT_COLLECTOR:
      if (action.artifactCollector) {
        return {
          ...state,
          selectedLayoutElement: { ...state.selectedLayoutElement }
        };
      } else return { ...state };
    case LayoutEditorActionType.ADD_ARTIFACT_COLLECTOR:
      if (action.artifactCollector && state.selectedLayoutElement) {
        const selected = state.selectedLayoutElement as ILayoutElement;
        if (selected.approvalConfig) {
          selected.approvalConfig.artifactCollectors.push(
            action.artifactCollector
          );
        } else {
          selected.approvalConfig = {
            segmentName: selected.segment?.name || "",
            stepName: selected.step?.name || "",
            artifactCollectors: [action.artifactCollector]
          };
          state.approvalConfigs.push(selected.approvalConfig);
        }
        return {
          ...state,
          selectedLayoutElement: { ...state.selectedLayoutElement }
        };
      } else return { ...state };
    case LayoutEditorActionType.DELETE_ARTIFACT_COLLECTOR:
      if (
        action.artifactCollector &&
        state.selectedLayoutElement &&
        state.selectedLayoutElement.approvalConfig
      ) {
        const collectorIndex = state.selectedLayoutElement.approvalConfig.artifactCollectors.indexOf(
          action.artifactCollector
        );
        if (collectorIndex >= 0) {
          state.selectedLayoutElement.approvalConfig.artifactCollectors.splice(
            collectorIndex,
            1
          );
          return {
            ...state,
            selectedLayoutElement: { ...state.selectedLayoutElement }
          };
        }
      }
      return { ...state };
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
    detailPanelMode: DetailsPanelType.EMPTY,
    approvalConfigs: []
  });
  return { state: state, dispatch: dispatch };
};

export const useLayoutEditorStore = () => useContext(LayoutEditorStoreContext);
