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
import { lighten } from "polished";
import React from "react";
import { NavLink, Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

import { FlexColumn, FlexRow } from "../atoms/Flex";
import { generateMediaQuery } from "../util/mediaQuery";

export const SettingsPageContainer = styled.section`
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.userSettingsPage.bgColor};
`;

export const SidePanel = styled(FlexColumn)`
  box-sizing: border-box;
  padding: 1rem 0;
  flex-basis: 14rem;
  background-color: ${props => props.theme.userSettingsPage.sidePanel.bgColor};
  transition: flex-basis 500ms ease-in-out;

  ${generateMediaQuery(
    "max-width",
    "md",
    `
    flex-basis: 1rem;
    padding: 0;
    `
  )};
`;

export const SidePanelHeader = styled.li`
  color: ${props => props.theme.userSettingsPage.sidePanel.sidePanelItem.fontColor};
  align-items: center;
  display: flex;
  font-size: 1rem;
  margin: 0.25rem 0.75rem 1.25rem;

  ${generateMediaQuery("max-width", "md", `margin: 1rem`)}
`;

export const SidePanelLink = styled(NavLink)`
  text-decoration: none;
  display: flex;
  align-items: center;
  color: ${props => props.theme.userSettingsPage.sidePanel.sidePanelItem.fontColor};
  padding: 0.9rem 0.75rem;
  font-size: 0.9rem;
  border-left: "none";

  &:hover {
    cursor: pointer;
    background-color: ${props => lighten(0.05, props.theme.userSettingsPage.sidePanel.sidePanelItem.bgColor)};
  }

  &:visited {
    color: inherit;
  }

  &.active {
    background-color: ${props => props.theme.userSettingsPage.sidePanel.sidePanelItem.activeBgColor};
    border-left: 0.25rem solid ${props => props.theme.userSettingsPage.sidePanel.sidePanelItem.highlightColor};

    &:hover {
      background-color: ${props => props.theme.userSettingsPage.sidePanel.sidePanelItem.activeBgColor};
    }
  }
`;

export const SidePanelItemIcon = styled.img`
  width: 1.1rem;
  margin: 0 0.75rem 0 0;

  ${generateMediaQuery("max-width", "md", `margin: 0; width: 1.5rem;`)};
`;

export const SidePanelHeaderIcon = styled.img`
  width: 1.1rem;
  margin: 0 0.8rem 0 0.3rem;

  ${generateMediaQuery("max-width", "md", `margin: 0; width: 1.5rem;`)};
`;

export const SidePanelItemLabel = styled.span`
  ${generateMediaQuery("max-width", "md", `display: none`)};
`;

export const SplitLayout = styled(FlexRow)`
  height: 100%;
`;

export const ContentColumn = styled(FlexColumn)`
  flex-grow: 1;
  padding: 1rem 2rem;
`;
