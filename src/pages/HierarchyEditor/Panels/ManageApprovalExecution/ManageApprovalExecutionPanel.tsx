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
import { Panel } from "../../../../molecules/Panel";
import React, { useContext, useEffect } from "react";
import { useUserProfileContext } from "../../../../stores/UserProfile";
import DataRequest from "../../../../types/DataRequest";
import { StateContext } from "../../../../stores/hierarchyEditorStore";
import useDataApi from "../../../../hooks/useDataApi";
import { customGenericDataFetchReducer } from "../../../../stores/genericDataFetchReducer";
import AlternateLoader from "../../../../atoms/Icons/AlternateLoader";
import { ThemeContext } from "styled-components";
import { IApprovalConfig } from "../../../../interfaces/IApprovalConfig";
import {
  ApprovalExecutionActionType,
  ApprovalExecutionStoreContext,
  createApprovalExecutionStoreContext,
  ILoadApprovalAction,
  ISelectApprovalAction
} from "../../../../stores/ApprovalExecutionStore";
import ApprovalExecutionDetailsPanel from "./ApprovalExecutionDetailsPanel";

interface IApprovalStepsResponse {
  isLoading: boolean;
  data: Array<IApprovalConfig>;
}

const ManageApprovalExecutionPanel: React.FC = () => {
  const theme = useContext(ThemeContext);
  const { token } = useUserProfileContext();
  const [state, _dispatch] = useContext(StateContext);
  const [approvalStepsResponse, setApprovalSteps] = useDataApi<
    IApprovalStepsResponse,
    Array<IApprovalConfig>
  >(customGenericDataFetchReducer);
  const approvalExecutionStoreContext = createApprovalExecutionStoreContext();

  const cbSelectApproval = (approvalStep: IApprovalConfig) => {
    approvalExecutionStoreContext.dispatch({
      type: ApprovalExecutionActionType.SELECT_APPROVAL_STEP,
      selectedApprovalConfig: approvalStep
    } as ISelectApprovalAction);
  };

  const renderApprovalStepList = () => {
    if (!approvalExecutionStoreContext.state.availableApprovalConfigs.length) {
      return null;
    }
    return (
      <ul>
        {approvalExecutionStoreContext.state?.availableApprovalConfigs.map(
          approvalStep => (
            <li onClick={() => cbSelectApproval(approvalStep)}>
              {approvalStep.segmentName} {approvalStep.stepName}
            </li>
          )
        )}
      </ul>
    );
  };
  useEffect(() => {
    const dataRequest: DataRequest = {
      method: "get",
      token,
      url: `/api/supplychain/${state.nodeReferenceId}/layout/approvalconfig/me`,
      cbSuccess: (approvalConfigs: Array<IApprovalConfig>) => {
        approvalExecutionStoreContext.dispatch({
          type: ApprovalExecutionActionType.LOAD_APPROVAL_STEPS,
          availableApprovalConfigs: approvalConfigs
        } as ILoadApprovalAction);
      }
    };
    setApprovalSteps(dataRequest);
  }, [state.nodeReferenceId]);

  return (
    <>
      <ApprovalExecutionStoreContext.Provider
        value={approvalExecutionStoreContext}>
        <Panel
          width={"37.5vw"}
          resizable={true}
          title={"Select step to approve"}>
          {approvalStepsResponse.isLoading ? (
            <AlternateLoader size={32} color={theme.alternateLoader.color} />
          ) : null}
          {renderApprovalStepList()}
        </Panel>
        <ApprovalExecutionDetailsPanel />
      </ApprovalExecutionStoreContext.Provider>
    </>
  );
};
export default ManageApprovalExecutionPanel;
