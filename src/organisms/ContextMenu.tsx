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
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { ListGroup, ListGroupItem } from "react-bootstrap";

const Nav = styled.nav<{ displayContextMenu: boolean }>`
  display: ${props => (props.displayContextMenu ? "flex" : "none")};
  position: absolute;
  background: ${props => props.theme.dashboardPage.contextMenu.bgColor};
  right: 0;
  border: 1px solid ${props => props.theme.dashboardPage.contextMenu.borderColor};
  margin: 0.25rem 0 0;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 3;
`;

const MenuItem = styled(ListGroupItem)`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.dashboardPage.contextMenu.menuItemBgColor};
  color: ${props => props.theme.dashboardPage.contextMenu.menuItemTextColor};
  padding: 0.25% 0.9rem;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.theme.dashboardPage.contextMenu.menuItemHoverBgColor};
  }
`;

const MenuItemLink = styled(NavLink)`
  text-decoration: none;
`;

const DisabledMenuItemLink = styled.span`
  text-decoration: none;
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.dashboardPage.contextMenu.dividerBgColor};
`;

const TransparentClickOverlay = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export interface ContextmenuItemsProps {
  linkPath: string;
  labelText: string;
  handleOnClick: (e: any) => void;
}

export interface ContextmenuProps {
  displayMenu: boolean;
  setDisplayMenu: (setting: boolean) => void;
  items: ContextmenuItemsProps[];
  disabled: boolean;
}

export function ContextMenu(props: ContextmenuProps): React.ReactElement {
  const { displayMenu, setDisplayMenu, items, disabled } = props;

  return (
    <>
      {displayMenu ? <TransparentClickOverlay onClick={() => setDisplayMenu(false)} /> : null}
      <Nav displayContextMenu={displayMenu}>
        <ListGroup>
          {items
            ? items.map((item: ContextmenuItemsProps, index: number) => {
                return (
                  <MenuItem key={index}>
                    {disabled ? (
                      <DisabledMenuItemLink>{item.labelText}</DisabledMenuItemLink>
                    ) : (
                      <>
                        <MenuItemLink to={item.linkPath} onClick={item.handleOnClick}>
                          {item.labelText}
                        </MenuItemLink>
                        <MenuDivider />
                      </>
                    )}
                  </MenuItem>
                );
              })
            : null}
        </ListGroup>
      </Nav>
    </>
  );
}
