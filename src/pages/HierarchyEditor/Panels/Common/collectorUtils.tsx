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
import {
  IArtifactCollector,
  ArtifactCollectorType
} from "../../../../interfaces/IApprovalConfig";
import React from "react";
import XLDeployExecutionForm, {
  IXLDeployFormValues
} from "./XLDeployExecutionForm";
import GitExecutionForm, { IGitFormValues } from "./GitExecutionForm";
import CollapsibleContainerComponent from "../../../../atoms/CollapsibleContainer";

export interface ICollectorExecutionContext {
  config: IArtifactCollector;
  executionValues: IXLDeployFormValues | IGitFormValues;
  valid: boolean;
}

export function renderCollectorForm(
  collector: IArtifactCollector,
  index: number,
  validateNow: boolean,
  executionContexts: ICollectorExecutionContext[],
  onUpdateExecutionValues: (
    formValues: any,
    index: number,
    valid: boolean
  ) => void,
  onSubmit: (index: number) => void
) {
  switch (collector.type) {
    case ArtifactCollectorType.XLDEPLOY:
      return (
        <>
          <XLDeployExecutionForm
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
}

export function renderCollectorRow(
  index: number,
  activeCollector: number,
  executionContexts: ICollectorExecutionContext[],
  setValidateNow: React.Dispatch<React.SetStateAction<boolean>>,
  setActiveCollector: React.Dispatch<React.SetStateAction<number>>,
  validateNow: boolean,
  onUpdateExecutionValues: (
    formValues: any,
    index: number,
    valid: boolean
  ) => void,
  onSubmit: (index: number) => void
) {
  return (
    <li key={"executionContext" + index}>
      <CollapsibleContainerComponent
        collapsedByDefault={activeCollector !== index}
        title={executionContexts[index].config.name}
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
          ? renderCollectorForm(
              executionContexts[index].config,
              index,
              validateNow,
              executionContexts,
              onUpdateExecutionValues,
              onSubmit
            )
          : null}
      </CollapsibleContainerComponent>
    </li>
  );
}
