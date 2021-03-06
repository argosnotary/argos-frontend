/*
 * Copyright (C) 2020 Argos Notary
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
import DataRequest from "../../../../types/DataRequest";
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
import SelectList, { SelectListItem } from "../../../../atoms/SelectList";
import { cryptoAvailable } from "../../../../security";
import { NoCryptoWarning } from "../../../../molecules/NoCryptoWarning";
import { HierarchyEditorStateContext } from "../../../../stores/hierarchyEditorStore";

interface IApprovalStepsResponse {
  isLoading: boolean;
  data: Array<IApprovalConfig>;
}

const ManageApprovalExecutionPanel: React.FC = () => {
  const theme = useContext(ThemeContext);
  const [hierarchyEditorState] = useContext(HierarchyEditorStateContext);
  const [approvalStepsResponse, setApprovalSteps] = useDataApi<
    IApprovalStepsResponse,
    Array<IApprovalConfig>
  >(customGenericDataFetchReducer);
  const approvalExecutionStoreContext = createApprovalExecutionStoreContext();

  useEffect(() => {
    const dataRequest: DataRequest = {
      method: "get",
      url: `/api/supplychain/${hierarchyEditorState.editor.node.referenceId}/layout/approvalconfig/me`,
      cbSuccess: (approvalConfigs: Array<IApprovalConfig>) => {
        approvalExecutionStoreContext.dispatch({
          type: ApprovalExecutionActionType.LOAD_APPROVAL_STEPS,
          availableApprovalConfigs: approvalConfigs
        } as ILoadApprovalAction);
      }
    };
    setApprovalSteps(dataRequest);
  }, [hierarchyEditorState.editor.node.referenceId]);
  const cbSelectApproval = (approvalStep: IApprovalConfig) => {
    approvalExecutionStoreContext.dispatch({
      type: ApprovalExecutionActionType.SELECT_APPROVAL_STEP,
      selectedApprovalConfig: approvalStep
    } as ISelectApprovalAction);
  };

  const isSelected = (approvalStep: IApprovalConfig): boolean => {
    return (
      approvalStep == approvalExecutionStoreContext.state.selectedApprovalConfig
    );
  };

  const renderApprovalStepList = () => {
    if (!approvalExecutionStoreContext.state.availableApprovalConfigs.length) {
      return (
        <p data-testhook-id={"no-approvals"}>No approval steps were found</p>
      );
    }
    return (
      <SelectList>
        {approvalExecutionStoreContext.state?.availableApprovalConfigs.map(
          (approvalStep, index) => (
            <SelectListItem
              fieldName={"approval-step-choice"}
              fieldValue={`${approvalStep.segmentName}-${approvalStep.stepName}`}
              key={`approvalStep-${index}`}
              onSelect={() => cbSelectApproval(approvalStep)}
              checked={isSelected(approvalStep)}>
              {approvalStep.segmentName} - {approvalStep.stepName}
            </SelectListItem>
          )
        )}
      </SelectList>
    );
  };

  return (
    <>
      <ApprovalExecutionStoreContext.Provider
        value={approvalExecutionStoreContext}>
        <Panel
          width={"37.5vw"}
          resizable={true}
          title={"Select step to approve"}>
          {cryptoAvailable() ? (
            <>
              {approvalStepsResponse.isLoading ? (
                <AlternateLoader
                  size={32}
                  color={theme.alternateLoader.color}
                />
              ) : null}
              {renderApprovalStepList()}
            </>
          ) : (
            <NoCryptoWarning />
          )}
        </Panel>
        <ApprovalExecutionDetailsPanel />
      </ApprovalExecutionStoreContext.Provider>
    </>
  );
};
export default ManageApprovalExecutionPanel;
