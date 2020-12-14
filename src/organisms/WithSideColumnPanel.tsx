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
import { lighten } from "polished";
import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink, Route } from "react-router-dom";
import styled from "styled-components";

import { FlexColumn, FlexRow } from "../atoms/Flex";
import { generateMediaQuery } from "../util/mediaQuery";
import { Panel } from "./Panel";

const StyledWithSideColumnPanel = styled(Panel)`
  background-color: ${props => props.theme.withSideColumnPanel.bgColor};
`;

const SideColumn = styled(FlexColumn)`
  box-sizing: border-box;
  padding: 1rem 0;
  flex-basis: 14rem;
  background-color: ${props => props.theme.withSideColumnPanel.sideColumn.bgColor};
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

const SideColumnHeader = styled.li`
  color: ${props => props.theme.withSideColumnPanel.sideColumn.sideColumnItem.fontColor};
  align-items: center;
  display: flex;
  font-size: 1rem;
  margin: 0.25rem 0.75rem 1.25rem;

  ${generateMediaQuery("max-width", "md", `margin: 1rem`)}
`;

const SideColumnItemIcon = styled.img`
  width: 1.1rem;
  margin: 0 0.75rem 0 0;

  ${generateMediaQuery("max-width", "md", `margin: 0; width: 1.5rem;`)};
`;

const SideColumnHeaderIcon = styled.img`
  width: 1.1rem;
  margin: 0 0.8rem 0 0.3rem;

  ${generateMediaQuery("max-width", "md", `margin: 0; width: 1.5rem;`)};
`;

const SideColumnItemLabel = styled.span`
  ${generateMediaQuery("max-width", "md", `display: none`)};
`;

const SplitLayoutStyle = styled(FlexRow)`
  height: 100%;
`;

const ContentColumn = styled(FlexColumn)`
  flex-grow: 1;
  padding: 0rem 1rem;
`;

const SideColumnItemNavLink = styled(NavLink)`
  text-decoration: none;
  display: flex;
  align-items: center;
  color: ${props => props.theme.withSideColumnPanel.sideColumn.sideColumnItem.fontColor};
  padding: 0.9rem 0.75rem;
  font-size: 0.9rem;
  border-left: "none";

  &:hover {
    cursor: pointer;
    background-color: ${props => lighten(0.05, props.theme.withSideColumnPanel.sideColumn.sideColumnItem.bgColor)};
  }

  &:visited {
    color: inherit;
  }

  &.active {
    background-color: ${props => props.theme.withSideColumnPanel.sideColumn.sideColumnItem.activeBgColor};
    border-left: 0.25rem solid ${props => props.theme.withSideColumnPanel.sideColumn.sideColumnItem.highlightColor};

    &:hover {
      background-color: ${props => props.theme.withSideColumnPanel.sideColumn.sideColumnItem.activeBgColor};
    }
  }
`;

export interface SideColumnHeaderProps {
  icon: string;
  text: string;
}

export interface WithSideColumnPanelItem {
  icon: string;
  path: string;
  component: JSX.Element;
  text: string;
}

interface WithSideColumnPanelProps {
  items: WithSideColumnPanelItem[];
  header: SideColumnHeaderProps;
  defaultItem?: number;
}

export function WithSideColumnPanel(props: WithSideColumnPanelProps): React.ReactElement {
  const { items, header } = props;

  return (
    <StyledWithSideColumnPanel header={false}>
      <SplitLayoutStyle>
        <SideColumn>
          <Nav>
            <SideColumnHeader>
              <SideColumnHeaderIcon src={header.icon} />
              <SideColumnItemLabel>{header.text}</SideColumnItemLabel>{" "}
            </SideColumnHeader>
            {items
              ? items.map((item: WithSideColumnPanelItem, index: number) => {
                  return (
                    <SideColumnItemNavLink key={index} to={item.path}>
                      <SideColumnItemIcon src={item.icon} />
                      <SideColumnItemLabel>{item.text}</SideColumnItemLabel>
                    </SideColumnItemNavLink>
                  );
                })
              : null}
          </Nav>
        </SideColumn>
        {items
          ? items.map((item, index) => (
              <Route key={index} path={item.path}>
                <ContentColumn>{item.component}</ContentColumn>
              </Route>
            ))
          : null}
      </SplitLayoutStyle>
    </StyledWithSideColumnPanel>
  );
}
