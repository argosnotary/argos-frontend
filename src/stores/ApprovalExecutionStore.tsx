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

interface IApprovalExecutionStoreContext {
  state: IApprovalExecutionState;
  dispatch: Dispatch<IApprovalExecutionAction>;
}

export interface IApprovalExecutionAction {
  type: ApprovalExecutionActionType;
  selectedApprovalConfig: IApprovalConfig;
}

export enum ApprovalExecutionActionType {
  SELECT_APPROVAL_STEP
}

const reducer = (
  state: IApprovalExecutionState,
  action: IApprovalExecutionAction
): IApprovalExecutionState => {
  switch (action.type) {
    case ApprovalExecutionActionType.SELECT_APPROVAL_STEP:
      return {
        ...state,
        selectedApprovalConfig: action.selectedApprovalConfig
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
