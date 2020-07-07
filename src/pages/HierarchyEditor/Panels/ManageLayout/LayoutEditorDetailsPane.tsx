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
import React from "react";
import styled from "styled-components";

import NotificationsList, {
  INotification,
  NotificationTypes
} from "../../../../molecules/NotificationsList";
import { Panel } from "../../../../molecules/Panel";
import { CollectionContainer } from "../../../../atoms/Collection";
import {
  DetailsPanelType,
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import { ILayoutValidationMessage } from "../../../../interfaces/ILayout";
import LayoutAuthorizedAccountEditor from "./LayoutAuthorizedAccountEditor";
import ApprovalConfigEditor, { FormContainer } from "./ApprovalConfigEditor";
import RuleEditor from "./RuleEditor";
import RequiredNumberOfLinks from "./RequiredNumberOfLinks";
import StepAuthorizedAccountEditor from "./StepAuthorizedAccountEditor";

const PanelSpecificStyling = styled.div`
  ${CollectionContainer} {
    &:first-of-type {
      margin-top: 3rem;
    }

    margin-top: 2.1rem;
  }

  ${FormContainer} {
    &:first-of-type {
      margin: 0;
    }

    margin: 0;
  }
`;

const convertValidationMessagesToNotifications = (
  validationErrors?: Array<ILayoutValidationMessage>
) => {
  if (validationErrors === undefined) {
    return [];
  }

  return validationErrors.map((message: ILayoutValidationMessage) => {
    const notification: INotification = {} as INotification;

    notification.body = `${message.field ? message.field : ""} ${
      message.message
    }`;
    notification.type = NotificationTypes.ERROR;

    return notification;
  });
};

const StepDetailsContainer = styled.div`
  ${CollectionContainer} {
    &:first-of-type {
      margin-top: 2.1rem;
    }
  }
`;

const LayoutEditorDetailsPane: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const determinePanelContent = () => {
    switch (editorStoreContext.state.detailPanelMode) {
      case DetailsPanelType.VALIDATION_ERRORS:
        return (
          <NotificationsList
            notifications={convertValidationMessagesToNotifications(
              editorStoreContext.state.validationErrors
            )}
          />
        );
      case DetailsPanelType.STEP_DETAILS:
        return (
          <StepDetailsContainer>
            <ApprovalConfigEditor />
            <RequiredNumberOfLinks />
            <StepAuthorizedAccountEditor />
            <RuleEditor
              title={"Expected Materials"}
              initialRules={
                editorStoreContext.state.selectedLayoutElement?.step
                  ?.expectedMaterials
              }
              addAction={LayoutEditorActionType.ADD_MATERIAL_RULE}
              editAction={LayoutEditorActionType.EDIT_MATERIAL_RULE}
              removeAction={LayoutEditorActionType.REMOVE_MATERIAL_RULE}
            />
            <RuleEditor
              title={"Expected Products"}
              initialRules={
                editorStoreContext.state.selectedLayoutElement?.step
                  ?.expectedProducts
              }
              addAction={LayoutEditorActionType.ADD_PRODUCT_RULE}
              editAction={LayoutEditorActionType.EDIT_PRODUCT_RULE}
              removeAction={LayoutEditorActionType.REMOVE_PRODUCT_RULE}
            />
          </StepDetailsContainer>
        );
      case DetailsPanelType.LAYOUT_DETAILS:
        return (
          <>
            <LayoutAuthorizedAccountEditor />
            <RuleEditor
              title={"Expected End Products"}
              initialRules={editorStoreContext.state.layout.expectedEndProducts}
              addAction={LayoutEditorActionType.ADD_EXPECTED_END_PRODUCT}
              editAction={LayoutEditorActionType.EDIT_EXPECTED_END_PRODUCT}
              removeAction={LayoutEditorActionType.REMOVE_EXPECTED_END_PRODUCT}
            />
          </>
        );
    }
  };

  const determineTitle = (): string => {
    switch (editorStoreContext.state.detailPanelMode) {
      case DetailsPanelType.VALIDATION_ERRORS:
        return "Validation errors";
      case DetailsPanelType.STEP_DETAILS:
        return `Edit step ${editorStoreContext.state.selectedLayoutElement?.step?.name} configuration`;
    }

    return "";
  };

  return (
    <Panel width={"37.5vw"} last={true} title={determineTitle()}>
      <PanelSpecificStyling>{determinePanelContent()}</PanelSpecificStyling>
    </Panel>
  );
};

export default LayoutEditorDetailsPane;
