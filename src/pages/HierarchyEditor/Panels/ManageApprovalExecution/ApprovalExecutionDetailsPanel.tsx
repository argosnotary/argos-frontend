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
import { Button, CancelButton } from "../../../../atoms/Button";
import FlexRow from "../../../../atoms/FlexRow";
import styled from "styled-components";

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
    type: ArtifactCollectorType,
    _index: number
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

  const handleApprove = () => {
    console.log("handleApprove");
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
            validateApprovalExecutionForm(values, collector.type, index)
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
        <ul>
          {executionContexts.map((executionContext, index) => {
            return (
              <li key={"executionContext" + index}>
                <CollapsibleContainerComponent
                  enabled={executionContexts[activeCollector].valid}
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
          })}
        </ul>
        <ApproveButtonContainer>
          <Button
            onClick={handleApprove}
            disabled={
              executionContexts.findIndex(context => !context.valid) >= 0
            }>
            Approve
          </Button>
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
