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
  IPublicKey,
  IRule,
  IStep
} from "../interfaces/ILayout";
import {
  IApprovalConfig,
  IArtifactCollector
} from "../interfaces/IApprovalConfig";
import {
  addExpectedEndProduct,
  addLayoutAuthorizedKey,
  addMaterialRule,
  addProductRule,
  addStepAuthorizedKey,
  deleteLayoutAuthorizedKey,
  deleteStepAuthorizedKey,
  editExpectedEndProduct,
  editMaterialRule,
  editProductRule,
  removeExpectedEndProduct,
  removeMaterialRule,
  removeProductRule,
  updateRequiredNumberOfLinks
} from "./LayoutEditorService";

export enum DetailsPanelType {
  EMPTY,
  VALIDATION_ERRORS,
  STEP_DETAILS,
  LAYOUT_DETAILS
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
  showJson: boolean;
}

export interface ILayoutEditorStoreContext {
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
  DELETE_ARTIFACT_COLLECTOR,
  ADD_LAYOUT_AUTHORIZED_KEY,
  DELETE_LAYOUT_AUTHORIZED_KEY,
  EDIT_LAYOUT,
  ADD_EXPECTED_END_PRODUCT,
  REMOVE_EXPECTED_END_PRODUCT,
  EDIT_EXPECTED_END_PRODUCT,
  ADD_PRODUCT_RULE,
  REMOVE_PRODUCT_RULE,
  EDIT_PRODUCT_RULE,
  ADD_MATERIAL_RULE,
  REMOVE_MATERIAL_RULE,
  EDIT_MATERIAL_RULE,
  UPDATE_REQUIRED_NUMBER_OF_LINKS,
  ADD_STEP_AUTHORIZED_KEY,
  DELETE_STEP_AUTHORIZED_KEY,
  SHOW_JSON
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
  publicKey?: IPublicKey;
  rule?: IRule;
  showJson?: boolean;
}

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
      return handleUpdateLayout(action, state);
    case LayoutEditorActionType.EDIT_LAYOUT_ELEMENT:
      return handleEditLayoutElement(state, action);
    case LayoutEditorActionType.SELECT_STEP:
      return handleSelectStep(state, action);
    case LayoutEditorActionType.DEACTIVATE_LAYOUT_ELEMENT:
      return {
        ...state,
        activeEditLayoutElement: undefined,
        detailPanelMode: DetailsPanelType.EMPTY
      };
    case LayoutEditorActionType.ADD_SEGMENT:
      return handleAddSegment(action, state);
    case LayoutEditorActionType.UPDATE_NAME_ACTIVATE_LAYOUT_ELEMENT:
      return handleUpdateNameActiveLayoutElement(action, state);
    case LayoutEditorActionType.DELETE_SEGMENT:
      return handleDeleteSegment(action, state);
    case LayoutEditorActionType.LAYOUT_HAS_VALIDATION_ERRORS:
      return handleLayoutHasValidationErrors(action, state);
    case LayoutEditorActionType.ADD_STEP:
      return handleAddStep(action, state);
    case LayoutEditorActionType.DELETE_STEP:
      return handleDeleteStep(action, state);
    case LayoutEditorActionType.START_SIGNING:
      return { ...state, showSigningDialog: true };
    case LayoutEditorActionType.STOP_SIGNING:
      return { ...state, showSigningDialog: false };
    case LayoutEditorActionType.UPDATE_APPROVAL_CONFIGS:
      return { ...state, approvalConfigs: action.approvalConfigs || [] };
    case LayoutEditorActionType.UPDATE_ARTIFACT_COLLECTOR:
      return handleUpdateArtifactCollector(action, state);
    case LayoutEditorActionType.ADD_ARTIFACT_COLLECTOR:
      return handleAddArtifactCollector(action, state);
    case LayoutEditorActionType.DELETE_ARTIFACT_COLLECTOR:
      return handleDeleteArtifactCollector(action, state);
    case LayoutEditorActionType.ADD_LAYOUT_AUTHORIZED_KEY:
      return handleAddLayoutAuthorizedKey(action, state);
    case LayoutEditorActionType.DELETE_LAYOUT_AUTHORIZED_KEY:
      return handleDeleteLayoutAuthorizedKey(action, state);
    case LayoutEditorActionType.EDIT_LAYOUT:
      return {
        ...state,
        selectedLayoutElement: undefined,
        detailPanelMode: DetailsPanelType.LAYOUT_DETAILS
      };
    case LayoutEditorActionType.ADD_EXPECTED_END_PRODUCT:
      return handleAddExpectedEndProduct(action, state);
    case LayoutEditorActionType.EDIT_EXPECTED_END_PRODUCT:
      return handleEditExpectedEndProduct(state);
    case LayoutEditorActionType.REMOVE_EXPECTED_END_PRODUCT:
      return handleRemoveExpectedEndProduct(action, state);
    case LayoutEditorActionType.ADD_MATERIAL_RULE:
      return handleAddMaterialRule(action, state);
    case LayoutEditorActionType.EDIT_MATERIAL_RULE:
      return handleEditMaterialRule(state);
    case LayoutEditorActionType.REMOVE_MATERIAL_RULE:
      return handleRemoveMaterialRule(action, state);
    case LayoutEditorActionType.ADD_PRODUCT_RULE:
      return handleAddProductRule(action, state);
    case LayoutEditorActionType.EDIT_PRODUCT_RULE:
      return handleEditProductRule(state);
    case LayoutEditorActionType.REMOVE_PRODUCT_RULE:
      return handleRemoveProductRule(action, state);
    case LayoutEditorActionType.ADD_STEP_AUTHORIZED_KEY:
      return handleAddStepAuthorizedKey(action, state);
    case LayoutEditorActionType.DELETE_STEP_AUTHORIZED_KEY:
      return handleDeleteStepAuthorizedKey(action, state);
    case LayoutEditorActionType.UPDATE_REQUIRED_NUMBER_OF_LINKS:
      return handleUpdateRequiredNumberOfLinks(action, state);
    case LayoutEditorActionType.SHOW_JSON:
      return {
        ...state,
        showJson: !state.showJson
      };
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
    approvalConfigs: [],
    showJson: false
  });
  return { state: state, dispatch: dispatch };
};

export const useLayoutEditorStore = () => useContext(LayoutEditorStoreContext);

const handleAddMaterialRule = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (
    action.rule &&
    state.selectedLayoutElement &&
    state.selectedLayoutElement.step
  ) {
    return {
      ...state,
      layout: addMaterialRule(
        state.layout,
        action.rule,
        state.selectedLayoutElement.step
      )
    };
  }
  return {
    ...state
  };
};

const handleEditMaterialRule = (
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (state.selectedLayoutElement && state.selectedLayoutElement.step) {
    return {
      ...state,
      layout: editMaterialRule(state.layout, state.selectedLayoutElement.step)
    };
  }
  return {
    ...state
  };
};

const handleRemoveMaterialRule = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (
    action.rule &&
    state.selectedLayoutElement &&
    state.selectedLayoutElement.step
  ) {
    return {
      ...state,
      layout: removeMaterialRule(
        state.layout,
        action.rule,
        state.selectedLayoutElement.step
      )
    };
  }
  return {
    ...state
  };
};

const handleAddProductRule = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (
    action.rule &&
    state.selectedLayoutElement &&
    state.selectedLayoutElement.step
  ) {
    return {
      ...state,
      layout: addProductRule(
        state.layout,
        action.rule,
        state.selectedLayoutElement.step
      )
    };
  }
  return {
    ...state
  };
};

const handleEditProductRule = (
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (state.selectedLayoutElement && state.selectedLayoutElement.step) {
    return {
      ...state,
      layout: editProductRule(state.layout, state.selectedLayoutElement.step)
    };
  }
  return {
    ...state
  };
};

const handleRemoveProductRule = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (
    action.rule &&
    state.selectedLayoutElement &&
    state.selectedLayoutElement.step
  ) {
    return {
      ...state,
      layout: removeProductRule(
        state.layout,
        action.rule,
        state.selectedLayoutElement.step
      )
    };
  }
  return {
    ...state
  };
};

const handleUpdateRequiredNumberOfLinks = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (
    action.layoutStep &&
    state.selectedLayoutElement &&
    state.selectedLayoutElement.step
  ) {
    return {
      ...state,
      layout: updateRequiredNumberOfLinks(
        state.layout,
        state.selectedLayoutElement.step,
        action.layoutStep.requiredNumberOfLinks
      )
    };
  }
  return {
    ...state
  };
};

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

const handleAddExpectedEndProduct = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (action.rule) {
    return {
      ...state,
      layout: addExpectedEndProduct(state.layout, action.rule)
    };
  }
  return {
    ...state
  };
};

const handleEditExpectedEndProduct = (
  state: ILayoutEditorState
): ILayoutEditorState => {
  return {
    ...state,
    layout: editExpectedEndProduct(state.layout)
  };
};

const handleRemoveExpectedEndProduct = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (action.rule) {
    return {
      ...state,
      layout: removeExpectedEndProduct(state.layout, action.rule)
    };
  }
  return {
    ...state
  };
};

const handleDeleteStepAuthorizedKey = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (
    action.publicKey &&
    state.selectedLayoutElement &&
    state.selectedLayoutElement.step
  ) {
    return {
      ...state,
      layout: deleteStepAuthorizedKey(
        state.layout,
        action.publicKey,
        state.selectedLayoutElement.step
      )
    };
  }

  return {
    ...state
  };
};

const handleAddStepAuthorizedKey = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (
    action.publicKey &&
    state.selectedLayoutElement &&
    state.selectedLayoutElement.step
  ) {
    return {
      ...state,
      layout: addStepAuthorizedKey(
        state.layout,
        action.publicKey,
        state.selectedLayoutElement.step
      )
    };
  }
  return {
    ...state
  };
};

const handleDeleteLayoutAuthorizedKey = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (action.publicKey) {
    return {
      ...state,
      layout: deleteLayoutAuthorizedKey(state.layout, action.publicKey)
    };
  }

  return {
    ...state
  };
};

const handleAddLayoutAuthorizedKey = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
): ILayoutEditorState => {
  if (action.publicKey) {
    return {
      ...state,
      layout: addLayoutAuthorizedKey(state.layout, action.publicKey)
    };
  }
  return {
    ...state
  };
};

const handleUpdateLayout = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.layout) {
    return {
      ...state,
      layout: action.layout,
      selectedLayoutElement: undefined,
      activeEditLayoutElement: undefined,
      showSigningDialog: false,
      detailPanelMode: DetailsPanelType.LAYOUT_DETAILS,
      validationErrors: undefined
    };
  }
  return { ...state };
};

const handleAddSegment = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.layoutSegment) {
    if (state.layout.layoutSegments === undefined) {
      state.layout.layoutSegments = [];
    }
    state.layout.layoutSegments.push(action.layoutSegment);
    return {
      ...state,
      layout: { ...state.layout },
      detailPanelMode: DetailsPanelType.EMPTY,
      activeEditLayoutElement: createSelectedLayoutElement(state, action)
    };
  }
  return { ...state };
};

const handleUpdateNameActiveLayoutElement = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.layoutElementName && state.activeEditLayoutElement) {
    if (
      state.activeEditLayoutElement.step &&
      state.activeEditLayoutElement.segment
    ) {
      renameApprovalConfigStepName(
        state,
        state.activeEditLayoutElement.segment.name,
        state.activeEditLayoutElement.step.name,
        action.layoutElementName
      );
      state.activeEditLayoutElement.step.name = action.layoutElementName;
    } else if (state.activeEditLayoutElement.segment) {
      renameApprovalConfigSegmentName(
        state,
        state.activeEditLayoutElement.segment.name,
        action.layoutElementName
      );
      state.activeEditLayoutElement.segment.name = action.layoutElementName;
    }
    return {
      ...state,
      activeEditLayoutElement: undefined,
      approvalConfigs: [...state.approvalConfigs],
      selectedLayoutElement: state.activeEditLayoutElement,
      layout: { ...state.layout },
      detailPanelMode: state.activeEditLayoutElement.step
        ? DetailsPanelType.STEP_DETAILS
        : DetailsPanelType.EMPTY
    };
  }
  return { ...state };
};

const renameApprovalConfigStepName = (
  state: ILayoutEditorState,
  currentSegmentName: string,
  currentStepName: string,
  newStepName: string
) => {
  state.approvalConfigs
    .filter(
      config =>
        config.stepName === currentStepName &&
        config.segmentName === currentSegmentName
    )
    .forEach(config => (config.stepName = newStepName));
};

const renameApprovalConfigSegmentName = (
  state: ILayoutEditorState,
  currentSegmentName: string,
  newSegmentName: string
) => {
  state.approvalConfigs
    .filter(config => config.segmentName === currentSegmentName)
    .forEach(config => (config.segmentName = newSegmentName));
};

const handleDeleteSegment = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.layoutSegment) {
    const segmentIndex = state.layout.layoutSegments.indexOf(
      action.layoutSegment
    );
    if (segmentIndex >= 0) {
      state.layout.layoutSegments.splice(segmentIndex, 1);
      removeApprovalConfig(state, action.layoutSegment.name);
      return {
        ...state,
        approvalConfigs: [...state.approvalConfigs],
        layout: { ...state.layout },
        selectedLayoutElement: undefined,
        activeEditLayoutElement: undefined,
        detailPanelMode: DetailsPanelType.EMPTY
      };
    }
  }
  return { ...state };
};

const handleDeleteStep = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.layoutSegment && action.layoutStep) {
    const stepIndex = action.layoutSegment.steps.indexOf(action.layoutStep);
    if (stepIndex >= 0) {
      action.layoutSegment.steps.splice(stepIndex, 1);
      removeApprovalConfig(
        state,
        action.layoutSegment.name,
        action.layoutStep.name
      );
      return {
        ...state,
        approvalConfigs: [...state.approvalConfigs],
        layout: { ...state.layout },
        selectedLayoutElement: undefined,
        activeEditLayoutElement: undefined,
        detailPanelMode: DetailsPanelType.EMPTY
      };
    }
  }
  return { ...state };
};

const removeApprovalConfig = (
  state: ILayoutEditorState,
  segmentName?: string,
  stepName?: string
) => {
  let indexesToRemove: number[] = [];
  if (segmentName && stepName) {
    indexesToRemove = state.approvalConfigs
      .filter(
        config =>
          config.stepName === stepName && config.segmentName === segmentName
      )
      .map((_config, index) => index);
  } else if (segmentName) {
    indexesToRemove = state.approvalConfigs
      .filter(config => config.segmentName === segmentName)
      .map((_config, index) => index);
  }
  indexesToRemove.forEach(index => state.approvalConfigs.splice(index, 1));
};

const handleAddArtifactCollector = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.artifactCollector && state.selectedLayoutElement) {
    const selected = state.selectedLayoutElement;
    if (selected.approvalConfig) {
      selected.approvalConfig.artifactCollectorSpecifications.push(
        action.artifactCollector
      );
    } else {
      selected.approvalConfig = {
        segmentName: selected.segment?.name || "",
        stepName: selected.step?.name || "",
        artifactCollectorSpecifications: [action.artifactCollector]
      };
      state.approvalConfigs.push(selected.approvalConfig);
    }
    return {
      ...state,
      selectedLayoutElement: { ...state.selectedLayoutElement }
    };
  } else return { ...state };
};

const handleDeleteArtifactCollector = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (
    action.artifactCollector &&
    state.selectedLayoutElement &&
    state.selectedLayoutElement.approvalConfig
  ) {
    deleteArtifactCollector(
      state,
      state.selectedLayoutElement.approvalConfig,
      action.artifactCollector
    );
    return {
      ...state,
      selectedLayoutElement: { ...state.selectedLayoutElement }
    };
  }
  return { ...state };
};

const deleteArtifactCollector = (
  state: ILayoutEditorState,
  approvalConfig?: IApprovalConfig,
  artifactCollector?: IArtifactCollector
) => {
  if (approvalConfig && artifactCollector) {
    const collectorIndex = approvalConfig.artifactCollectorSpecifications.indexOf(
      artifactCollector
    );
    if (collectorIndex >= 0) {
      approvalConfig.artifactCollectorSpecifications.splice(collectorIndex, 1);
      if (approvalConfig.artifactCollectorSpecifications.length == 0) {
        removeApprovalConfig(
          state,
          approvalConfig.segmentName,
          approvalConfig.stepName
        );
      }
    }
  }
};

const handleUpdateArtifactCollector = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.artifactCollector) {
    return {
      ...state,
      selectedLayoutElement: { ...state.selectedLayoutElement }
    };
  } else return { ...state };
};

const handleLayoutHasValidationErrors = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.validationErrors) {
    return {
      ...state,
      validationErrors: action.validationErrors,
      detailPanelMode: DetailsPanelType.VALIDATION_ERRORS
    };
  }
  return { ...state };
};

const handleAddStep = (
  action: ILayoutEditorAction,
  state: ILayoutEditorState
) => {
  if (action.layoutSegment && action.layoutStep) {
    if (action.layoutStep.authorizedKeyIds === undefined) {
      action.layoutStep.authorizedKeyIds = [];
    }

    if (action.layoutStep.expectedMaterials === undefined) {
      action.layoutStep.expectedMaterials = [];
    }

    if (action.layoutStep.expectedProducts === undefined) {
      action.layoutStep.expectedProducts = [];
    }

    action.layoutSegment.steps.push(action.layoutStep);
    return {
      ...state,
      layout: { ...state.layout },
      activeEditLayoutElement: createSelectedLayoutElement(state, action)
    };
  }
  return { ...state };
};

const handleEditLayoutElement = (
  state: ILayoutEditorState,
  action: ILayoutEditorAction
) => {
  return {
    ...state,
    activeEditLayoutElement: createSelectedLayoutElement(state, action),
    selectedLayoutElement: undefined,
    detailPanelMode: DetailsPanelType.EMPTY
  };
};

const handleSelectStep = (
  state: ILayoutEditorState,
  action: ILayoutEditorAction
) => {
  return {
    ...state,
    activeEditLayoutElement: undefined,
    selectedLayoutElement: createSelectedLayoutElement(state, action),
    detailPanelMode: DetailsPanelType.STEP_DETAILS
  };
};
