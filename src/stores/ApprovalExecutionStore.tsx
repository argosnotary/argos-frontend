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
import { IApprovalConfig } from "../interfaces/IApprovalConfig";
import React, { Dispatch, useContext, useReducer } from "react";

interface IApprovalExecutionState {
  selectedApprovalConfig: IApprovalConfig | undefined;
  availableApprovalConfigs: Array<IApprovalConfig>;
  loading: boolean;
}

export const ApprovalExecutionStoreContext = React.createContext<
  IApprovalExecutionStoreContext
>({} as IApprovalExecutionStoreContext);

export interface IApprovalExecutionStoreContext {
  state: IApprovalExecutionState;
  dispatch: Dispatch<IApprovalExecutionAction>;
}

export interface IApprovalExecutionAction {
  type: ApprovalExecutionActionType;
}

export interface ISelectApprovalAction extends IApprovalExecutionAction {
  selectedApprovalConfig: IApprovalConfig;
}

export interface ILoadApprovalAction extends IApprovalExecutionAction {
  availableApprovalConfigs: Array<IApprovalConfig>;
}

export enum ApprovalExecutionActionType {
  LOAD_APPROVAL_STEPS,
  SELECT_APPROVAL_STEP,
  DESELECT_APPROVAL_STEP
}

const reducer = (
  state: IApprovalExecutionState,
  action: IApprovalExecutionAction
): IApprovalExecutionState => {
  switch (action.type) {
    case ApprovalExecutionActionType.LOAD_APPROVAL_STEPS:
      return {
        ...state,
        availableApprovalConfigs: (action as ILoadApprovalAction)
          .availableApprovalConfigs
      };

    case ApprovalExecutionActionType.SELECT_APPROVAL_STEP:
      return {
        ...state,
        selectedApprovalConfig: (action as ISelectApprovalAction)
          .selectedApprovalConfig
      };
    case ApprovalExecutionActionType.DESELECT_APPROVAL_STEP:
      return {
        ...state,
        selectedApprovalConfig: undefined
      };
    default:
      throw new Error();
  }
};

export const createApprovalExecutionStoreContext = (): IApprovalExecutionStoreContext => {
  const [state, dispatch] = useReducer(reducer, {
    selectedApprovalConfig: undefined,
    availableApprovalConfigs: [],
    loading: false
  });
  return { state: state, dispatch: dispatch };
};

export const useApprovalExecutionStore = () =>
  useContext(ApprovalExecutionStoreContext);
