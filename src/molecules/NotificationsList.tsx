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
import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { WarningIcon } from "../atoms/Icons";
import SuccessIcon from "../atoms/Icons/SuccessIcon";

const NotificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 0 1rem;
  background-color: ${props =>
    props.theme.notificationsList.notificationBgColor};
`;

interface INotificationBodyProps {
  color: string;
}

const NotificationBody = styled.p<INotificationBodyProps>`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid ${props => props.color};
  color: ${props => props.color};
  padding: 0.5rem 1rem 0.5rem 0;
  font-size: 0.9rem;
  word-break: break-word;
`;

interface INotificationIconContainerProps {
  color: string;
}

const NotificationIconContainer = styled.div<INotificationIconContainerProps>`
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
`;

interface INotificationIndentProps {
  color: string;
}

const NotificationIdent = styled.span<INotificationIndentProps>`
  position: relative;
  left: -1px;
  display: flex;
  width: 0;
  height: 0;
  border-top: 0.5rem solid transparent;
  border-bottom: 0.5rem solid transparent;
  border-left: 0.5rem solid ${props => props.color};
  padding-right: 0.5rem;
`;

export enum NotificationTypes {
  ERROR = "ERROR",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS"
}

interface ITypeColors {
  [NotificationTypes.ERROR]: string;
  [NotificationTypes.WARNING]: string;
  [NotificationTypes.SUCCESS]: string;
}

const TypeColors = (colors: ITypeColors) => ({
  [NotificationTypes.ERROR]: colors[NotificationTypes.ERROR],
  [NotificationTypes.WARNING]: colors[NotificationTypes.WARNING],
  [NotificationTypes.SUCCESS]: colors[NotificationTypes.SUCCESS]
});

interface INotificationProps {
  notification: string;
  type: NotificationTypes;
}

export interface INotificationListTheme {
  iconColor: string;
  iconSize: number;
  colors: ITypeColors;
}

export const getTypeColor = (
  theme: INotificationListTheme,
  type: NotificationTypes
) => {
  return TypeColors(theme.colors)[type];
};

export const getTypeIcon = (
  theme: INotificationListTheme,
  type: NotificationTypes
) => {
  switch (type) {
    case NotificationTypes.WARNING:
    case NotificationTypes.ERROR:
      return (
        <NotificationIconContainer color={getTypeColor(theme, type)}>
          <WarningIcon color={theme.iconColor} size={theme.iconSize} />
        </NotificationIconContainer>
      );
    case NotificationTypes.SUCCESS:
      return (
        <NotificationIconContainer color={getTypeColor(theme, type)}>
          <SuccessIcon color={theme.iconColor} size={theme.iconSize} />
        </NotificationIconContainer>
      );
  }
};

export const Notification: React.FC<INotificationProps> = props => {
  const theme = useContext(ThemeContext);

  return (
    <NotificationContainer>
      {getTypeIcon(theme.notificationsList, props.type)}
      <NotificationBody
        color={getTypeColor(theme.notificationsList, props.type)}
      >
        <NotificationIdent
          color={getTypeColor(theme.notificationsList, props.type)}
        />
        {props.notification}
      </NotificationBody>
    </NotificationContainer>
  );
};

export interface INotification {
  body: string;
  type: NotificationTypes;
}

export interface INotificationListProps {
  notifications: Array<INotification>;
}

const NotificationsList: React.FC<INotificationListProps> = props => {
  return (
    <ul>
      {props.notifications.map((notification, key) => (
        <li key={key}>
          <Notification
            type={notification.type}
            notification={notification.body}
          />
        </li>
      ))}
    </ul>
  );
};

export default NotificationsList;
