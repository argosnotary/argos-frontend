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
import NotificationsList, {
  INotification,
  NotificationTypes
} from "../../../../molecules/NotificationsList";
import { Panel } from "../../../../molecules/Panel";
import {
  DetailsPanelType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import { ILayoutValidationMessage } from "../../../../interfaces/ILayout";
import ApprovalConfigEditor from "./ApprovalConfigEditor";

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

const LayoutEditorDetailsPane: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const determinePanelContent = () => {
    switch (editorStoreContext.state.detailPanelMode) {
      case DetailsPanelType.VALIDATION_ERRORS:
        return (
          <>
            <NotificationsList
              notifications={convertValidationMessagesToNotifications(
                editorStoreContext.state.validationErrors
              )}
            />
          </>
        );
      case DetailsPanelType.STEP_DETAILS:
        return (
          <>
            <ApprovalConfigEditor />
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
    <>
      <Panel width={"37.5vw"} last={true} title={determineTitle()}>
        {determinePanelContent()}
      </Panel>
    </>
  );
};

export default LayoutEditorDetailsPane;
