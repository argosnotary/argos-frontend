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
import React, { useEffect, useState } from "react";
import { Panel } from "../../../../molecules/Panel";
import {
  ApprovalExecutionActionType,
  IApprovalExecutionStoreContext,
  ISignArtifactsAction,
  useApprovalExecutionStore
} from "../../../../stores/ApprovalExecutionStore";
import {
  ArtifactCollectorType,
  IArtifactCollector,
  IGitContext,
  IXLDeployContext
} from "../../../../interfaces/IApprovalConfig";
import CollapsibleContainerComponent from "../../../../atoms/CollapsibleContainer";
import FlexRow from "../../../../atoms/FlexRow";
import styled from "styled-components";
import useDataApi from "../../../../hooks/useDataApi";
import DataRequest from "../../../../types/DataRequest";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import { IArtifact } from "../../../../interfaces/ILink";
import LinkSigner from "./LinkSigner";
import { Button, CancelButton, LoaderButton } from "../../../../atoms/Button";
import { Warning } from "../../../../atoms/Alerts";
import XLDeployApprovalForm, {
  IXLDeployFormValues
} from "../Common/XLDeployExecutionForm";
import GitExecutionForm, { IGitFormValues } from "../Common/GitExecutionForm";

const ApproveButtonContainer = styled(FlexRow)`
  margin: 1rem 0;

  ${Button} {
    margin: 0 1rem;

    &:first-of-type {
      margin: 0;
    }
  }
`;

interface ICollectorExecutionContext {
  config: IArtifactCollector;
  executionValues: IXLDeployFormValues | IGitFormValues;
  valid: boolean;
}

const createExecutionContexts = (context: IApprovalExecutionStoreContext) => {
  if (context.state.selectedApprovalConfig) {
    return context.state.selectedApprovalConfig.artifactCollectorSpecifications.map(
      collector => {
        return {
          config: collector,
          executionValues: {} as IXLDeployFormValues,
          valid: false
        };
      }
    );
  } else {
    return [];
  }
};

const ApprovalExecutionDetailsPanel: React.FC = () => {
  const approvalContext = useApprovalExecutionStore();
  const [activeCollector, setActiveCollector] = useState<number>(0);
  const [executionContexts, setExecutionContexts] = useState<
    Array<ICollectorExecutionContext>
  >(createExecutionContexts(approvalContext));
  const [collectError, setCollectorError] = useState<string | undefined>();

  const [validateNow, setValidateNow] = useState(false);

  useEffect(() => {
    setExecutionContexts(createExecutionContexts(approvalContext));
    setCollectorError(undefined);
  }, [approvalContext.state.selectedApprovalConfig]);

  const onUpdateExecutionValues = (
    formValues: any,
    index: number,
    valid: boolean
  ): void => {
    executionContexts[index].valid = valid;
    executionContexts[index].executionValues = formValues;
    setExecutionContexts([...executionContexts]);
  };

  const [collectorServiceApiResponse, setArtifactsRequest] = useDataApi(
    genericDataFetchReducer
  );

  const handleApprove = () => {
    setCollectorError(undefined);
    requestArtifacts([], 0);
  };

  const determineRunIdForGit = (values: IGitFormValues): string => {
    return values.branch !== undefined
      ? values.branch
      : values.tag !== undefined
      ? values.tag
      : values.commitHash !== undefined
      ? values.commitHash
      : "";
  };

  const determineRunId = (context: ICollectorExecutionContext): string => {
    switch (context.config.type) {
      case ArtifactCollectorType.XLDEPLOY:
        return (
          (context.config.context as IXLDeployContext).applicationName +
          "/" +
          (context.executionValues as IXLDeployFormValues).applicationVersion
        );
      case ArtifactCollectorType.GIT:
        return (
          (context.config.context as IGitContext).repository +
          "/" +
          determineRunIdForGit(context.executionValues as IGitFormValues)
        );
    }
  };

  const requestArtifacts = (artifacts: Array<IArtifact>, index: number) => {
    const context = executionContexts[index];

    const handleReceivedArtifacts = (newArtifacts: Array<IArtifact>) => {
      artifacts.push(...newArtifacts);
      const newIndex = index + 1;
      if (executionContexts[newIndex]) {
        requestArtifacts(artifacts, newIndex);
      } else {
        approvalContext.dispatch({
          type: ApprovalExecutionActionType.SIGN_ARTIFACTS,
          approvalSigningContext: {
            runId: determineRunId(context),
            stepName:
              approvalContext.state.selectedApprovalConfig?.stepName || "",
            segmentName:
              approvalContext.state.selectedApprovalConfig?.segmentName || "",
            artifactsToSign: artifacts
          }
        } as ISignArtifactsAction);
      }
    };

    const artifactsRequest: DataRequest = {
      method: "post",
      data: {
        ...context.config.context,
        ...context.executionValues
      },
      url: context.config.uri + "/api/collector/artifacts",
      cbSuccess: handleReceivedArtifacts,
      cbFailure: (error: any) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setCollectorError(error.response.data.message);
          return true;
        }
        return false;
      }
    };
    setArtifactsRequest(artifactsRequest);
  };

  const onCancel = () => {
    approvalContext.dispatch({
      type: ApprovalExecutionActionType.DESELECT_APPROVAL_STEP
    });
  };

  const onSubmit = (index: number) => {
    setActiveCollector(index + 1);
  };

  const renderForm = (index: number, collector: IArtifactCollector) => {
    switch (collector.type) {
      case ArtifactCollectorType.XLDEPLOY:
        return (
          <>
            <XLDeployApprovalForm
              index={index}
              validateNow={validateNow}
              initialValues={
                executionContexts[index].executionValues as IXLDeployFormValues
              }
              onUpdateExecutionValues={(form, valid) =>
                onUpdateExecutionValues(form, index, valid)
              }
              onSubmit={() => onSubmit(index)}
            />
          </>
        );
      case ArtifactCollectorType.GIT:
        return (
          <>
            <GitExecutionForm
              index={index}
              validateNow={validateNow}
              initialValues={
                executionContexts[index].executionValues as IGitFormValues
              }
              onUpdateExecutionValues={(form, valid) =>
                onUpdateExecutionValues(form, index, valid)
              }
              onSubmit={() => onSubmit(index)}
            />
          </>
        );
    }
  };

  const renderCollectorRow = (
    executionContext: ICollectorExecutionContext,
    index: number
  ) => {
    return (
      <li key={"executionContext" + index}>
        <CollapsibleContainerComponent
          collapsedByDefault={activeCollector !== index}
          title={executionContext.config.name}
          onExpand={() => {
            if (executionContexts[activeCollector]) {
              if (executionContexts[activeCollector].valid) {
                setValidateNow(false);
                setActiveCollector(index);
                return true;
              } else {
                return false;
              }
            } else {
              setValidateNow(false);
              setActiveCollector(index);
              return true;
            }
          }}
          onCollapse={() => {
            setValidateNow(true);
            return (
              executionContexts[activeCollector] &&
              executionContexts[activeCollector].valid
            );
          }}>
          {activeCollector === index
            ? renderForm(index, executionContext.config)
            : null}
        </CollapsibleContainerComponent>
      </li>
    );
  };

  if (executionContexts.length > 0) {
    return (
      <Panel
        width={"37.5vw"}
        last={true}
        title={
          "approve " +
          approvalContext.state.selectedApprovalConfig?.segmentName +
          " - " +
          approvalContext.state.selectedApprovalConfig?.stepName
        }>
        <LinkSigner />
        <ul>
          {executionContexts.map((executionContext, index) =>
            renderCollectorRow(executionContext, index)
          )}
        </ul>
        {collectError ? <Warning message={collectError} /> : null}
        <ApproveButtonContainer>
          <LoaderButton
            dataTesthookId={"approve-button"}
            onClick={handleApprove}
            loading={collectorServiceApiResponse.isLoading}
            buttonType={"button"}
            disabled={
              executionContexts.findIndex(context => !context.valid) >= 0
            }>
            Approve
          </LoaderButton>
          <CancelButton onMouseDown={onCancel}>Cancel</CancelButton>
        </ApproveButtonContainer>
      </Panel>
    );
  }
  return (
    <Panel width={"37.5vw"} last={true} title="">
      <div />
    </Panel>
  );
};

export default ApprovalExecutionDetailsPanel;
