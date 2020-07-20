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

import React, { Dispatch, SyntheticEvent, useContext } from "react";
import { useHistory } from "react-router-dom";
import styled, { ThemeContext } from "styled-components";
import { useUserProfileContext } from "../stores/UserProfile";
import useDataApi from "../hooks/useDataApi";
import genericDataFetchReducer from "../stores/genericDataFetchReducer";
import DataRequest from "../types/DataRequest";
import { LoaderIcon } from "../atoms/Icons";

interface IContextMenu {
  displayContextMenu: boolean;
  setDisplayContextMenu: Dispatch<boolean>;
}

const Nav = styled.nav<{ displayContextMenu: boolean }>`
  display: ${props => (props.displayContextMenu ? "flex" : "none")};
  position: absolute;
  background: ${props => props.theme.dashboardPage.contextMenu.bgColor};
  right: 0;
  border: 1px solid
    ${props => props.theme.dashboardPage.contextMenu.borderColor};
  margin: 0.25rem 0 0;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 3;
`;

const A = styled.a`
  text-decoration: none;
  &:visited {
    color: ${props => props.theme.dashboardPage.contextMenu.menuItemTextColor};
  }
`;

const MenuItem = styled.li`
  background-color: ${props =>
    props.theme.dashboardPage.contextMenu.menuItemBgColor};
  color: ${props => props.theme.dashboardPage.contextMenu.menuItemTextColor};
  padding: 0.5rem 3rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: ${props =>
      props.theme.dashboardPage.contextMenu.menuItemHoverBgColor};
  }
`;

const MenuDivider = styled.li`
  height: 1px;
  background-color: ${props =>
    props.theme.dashboardPage.contextMenu.dividerBgColor};
`;

const NavbarContextMenu: React.FC<IContextMenu> = props => {
  const history = useHistory();

  const useUserProfile = useUserProfileContext();

  const [logoutResponse, setLogoutApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const logoutUser = (e: SyntheticEvent) => {
    e.preventDefault();
    const dataRequest: DataRequest = {
      method: "put",
      data: {},
      token: useUserProfile.token,
      url: "/api/personalaccount/me/logout",
      cbSuccess: () => {
        props.setDisplayContextMenu(false);
        useUserProfile.setToken("");
        history.push("/login");
      }
    };
    setLogoutApiRequest(dataRequest);
  };

  const toSettings = (e: SyntheticEvent) => {
    e.preventDefault();
    props.setDisplayContextMenu(false);
    history.push("/settings");
  };

  const theme = useContext(ThemeContext);

  return (
    <Nav displayContextMenu={props.displayContextMenu}>
      <ul>
        <A href="/settings">
          <MenuItem onClick={toSettings}>Settings</MenuItem>
        </A>
        <MenuDivider />
        <A href="/logout">
          {logoutResponse.isLoading ? (
            <LoaderIcon
              size={12}
              color={theme.treeEditor.loaders.onFetchChildren.color}
            />
          ) : null}
          <MenuItem onClick={logoutUser}>Log out</MenuItem>
        </A>
      </ul>
    </Nav>
  );
};

export default NavbarContextMenu;
