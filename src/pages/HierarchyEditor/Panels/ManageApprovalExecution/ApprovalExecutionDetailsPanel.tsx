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
  IApprovalExecutionAction,
  IApprovalExecutionStoreContext,
  useApprovalExecutionStore
} from "../../../../stores/ApprovalExecutionStore";
import GenericForm, {
  IGenericFormSchema
} from "../../../../organisms/GenericForm";
import { FormPermissions } from "../../../../types/FormPermission";
import {
  ArtifactCollectorType,
  IArtifactCollector
} from "../../../../interfaces/IApprovalConfig";
import CollapsibleContainerComponent from "../../../../atoms/CollapsibleContainer";
import FlexRow from "../../../../atoms/FlexRow";
import styled from "styled-components";
import useDataApi from "../../../../hooks/useDataApi";
import DataRequest from "../../../../types/DataRequest";
import { IXLDeployExecutionContext } from "../../../../interfaces/IApprovalExecutionContext";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import { IArtifact } from "../../../../interfaces/ILink";
import LinkSigner from "./LinkSigner";
import { Button, CancelButton, LoaderButton } from "../../../../atoms/Button";

const ApproveButtonContainer = styled(FlexRow)`
  margin: 1rem 0;

  ${Button} {
    margin: 0 1rem;

    &:first-of-type {
      margin: 0;
    }
  }
`;

const defaultApprovalConfigFormSchema: IGenericFormSchema = [
  {
    labelValue: "Username",
    name: "username",
    formType: "text"
  },
  {
    labelValue: "Password",
    name: "password",
    formType: "password"
  }
];

const getApprovalExecutionFormSchema = (
  type: ArtifactCollectorType
): IGenericFormSchema => {
  if (type === ArtifactCollectorType.XLDEPLOY) {
    return [
      ...defaultApprovalConfigFormSchema,
      {
        labelValue: "Application Version",
        name: "applicationVersion",
        formType: "text"
      }
    ];
  }

  return [];
};

interface IFormValues {
  username: string;
  password: string;
  applicationVersion?: string;
}

interface ICollectorExecutionContext {
  config: IArtifactCollector;
  executionValues: IFormValues;
  valid: boolean;
}

const createExecutionContexts = (context: IApprovalExecutionStoreContext) => {
  if (context.state.selectedApprovalConfig) {
    return context.state.selectedApprovalConfig.artifactCollectorSpecifications.map(
      collector => {
        return {
          config: collector,
          executionValues: { username: "", password: "" },
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

  useEffect(() => {
    setExecutionContexts(createExecutionContexts(approvalContext));
  }, [approvalContext.state.selectedApprovalConfig]);

  const onUpdateExecutionValues = (
    formValues: any,
    index: number,
    valid: boolean
  ): void => {
    executionContexts[index].valid = valid;
    if (valid) {
      executionContexts[index].executionValues = formValues;
    }
    setExecutionContexts([...executionContexts]);
  };

  const getInitialValues = (_collector: IArtifactCollector, index: number) => {
    return executionContexts[index].executionValues;
  };

  const validateApprovalExecutionForm = (
    values: IFormValues,
    type: ArtifactCollectorType
  ) => {
    const errors = {} as IFormValues;

    if (!values.username) {
      errors.username = "Please fill in a username";
    }

    if (!values.password) {
      errors.password = "Please fill in a password";
    }

    if (type === ArtifactCollectorType.XLDEPLOY) {
      if (!values.applicationVersion) {
        errors.applicationVersion = "Please fill in a application name.";
      } else if (
        !new RegExp("^[^\\\\/\\]\\[:|,*]+$").test(values.applicationVersion)
      ) {
        errors.applicationVersion =
          "Please enter only valid characters for the application version (no `/`, `\\`, `:`, `[`, `]`, `|`, `,` or `*`)";
      }
    }
    return errors;
  };

  const [collectorServiceApiResponse, setArtifactsRequest] = useDataApi(
    genericDataFetchReducer
  );

  const handleApprove = () => {
    requestArtifacts([], 0);
  };

  const requestArtifacts = (artifacts: Array<IArtifact>, index: number) => {
    const context = executionContexts[index];
    const artifactsRequest: DataRequest = {
      method: "post",
      data: {
        applicationName: context.config.context.applicationName,
        version: context.executionValues.applicationVersion,
        username: context.executionValues.username,
        password: context.executionValues.password
      } as IXLDeployExecutionContext,
      token: "",
      url: context.config.uri + "/api/collector/artifacts",
      cbSuccess: (newArtifacts: Array<IArtifact>) => {
        artifacts.push(...newArtifacts);
        const newIndex = index + 1;
        if (executionContexts[newIndex]) {
          requestArtifacts(artifacts, newIndex);
        } else {
          approvalContext.dispatch({
            type: ApprovalExecutionActionType.SIGN_ARTIFACTS,
            artifactsToSign: artifacts
          } as IApprovalExecutionAction);
        }
      }
    };
    setArtifactsRequest(artifactsRequest);
  };

  const onCancel = () => {
    approvalContext.dispatch({
      type: ApprovalExecutionActionType.DESELECT_APPROVAL_STEP
    });
  };

  const renderForm = (index: number, collector: IArtifactCollector) => {
    return (
      <>
        <GenericForm
          dataTesthookId={"collector-execution-form-" + index}
          schema={getApprovalExecutionFormSchema(collector.type)}
          permission={FormPermissions.EDIT}
          isLoading={false}
          validate={values =>
            validateApprovalExecutionForm(values, collector.type)
          }
          onChange={(valid, form) =>
            onUpdateExecutionValues(form, index, valid)
          }
          onSubmit={() => {
            setActiveCollector(index + 1);
          }}
          initialValues={getInitialValues(collector, index)}
          confirmationLabel={"Next"}
          autoFocus={true}
        />
      </>
    );
  };

  const renderCollectorRow = (
    executionContext: ICollectorExecutionContext,
    index: number
  ) => {
    return (
      <li key={"executionContext" + index}>
        <CollapsibleContainerComponent
          enabled={
            executionContexts[activeCollector] &&
            executionContexts[activeCollector].valid
          }
          collapsedByDefault={activeCollector !== index}
          title={executionContext.config.name}
          onExpand={() => {
            setActiveCollector(index);
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
        <ApproveButtonContainer>
          <LoaderButton
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
