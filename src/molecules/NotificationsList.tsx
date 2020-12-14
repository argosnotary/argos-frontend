/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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

interface NotificationBodyProps {
  color: string;
}

const NotificationBody = styled.p<NotificationBodyProps>`
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

interface NotificationIconContainerProps {
  color: string;
}

const NotificationIconContainer = styled.div<NotificationIconContainerProps>`
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
`;

interface NotificationIndentProps {
  color: string;
}

const NotificationIdent = styled.span<NotificationIndentProps>`
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

interface TypeColors {
  [NotificationTypes.ERROR]: string;
  [NotificationTypes.WARNING]: string;
  [NotificationTypes.SUCCESS]: string;
}

const TypeColors = (colors: TypeColors) => ({
  [NotificationTypes.ERROR]: colors[NotificationTypes.ERROR],
  [NotificationTypes.WARNING]: colors[NotificationTypes.WARNING],
  [NotificationTypes.SUCCESS]: colors[NotificationTypes.SUCCESS]
});

interface NotificationProps {
  notification: string;
  type: NotificationTypes;
}

export interface NotificationListTheme {
  iconColor: string;
  iconSize: number;
  colors: TypeColors;
}

export const getTypeColor = (
  theme: NotificationListTheme,
  type: NotificationTypes
) => {
  return TypeColors(theme.colors)[type];
};

export const getTypeIcon = (
  theme: NotificationListTheme,
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

export const Notification: React.FC<NotificationProps> = props => {
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

export interface Notification {
  body: string;
  type: NotificationTypes;
}

export interface NotificationListProps {
  notifications: Array<Notification>;
}

const NotificationsList: React.FC<NotificationListProps> = props => {
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
