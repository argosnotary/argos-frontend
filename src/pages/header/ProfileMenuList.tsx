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
import React, { Dispatch, SyntheticEvent } from "react";
import { connect } from "react-redux";
import { logoutOnServer } from "../../redux/actions/tokenActions";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

interface ProfileMenuProps {
  displayProfileMenu: boolean;
  setDisplayProfileMenu: Dispatch<boolean>;
}

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

const MenuItem = styled.li`
  background-color: ${props => props.theme.dashboardPage.contextMenu.menuItemBgColor};
  color: ${props => props.theme.dashboardPage.contextMenu.menuItemTextColor};
  padding: 0.5rem 3rem;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: ${props => props.theme.dashboardPage.contextMenu.menuItemHoverBgColor};
  }
`;

const MenuDivider = styled.li`
  height: 1px;
  background-color: ${props => props.theme.dashboardPage.contextMenu.dividerBgColor};
`;

function ProfileMenuList(props: any) {
  const { displayProfileMenu, setDisplayProfileMenu, logoutOnServer } = props;
  const history = useHistory();
  const toSettings = (e: SyntheticEvent) => {
    e.preventDefault();
    setDisplayProfileMenu(false);
    history.push("/me");
  };

  return (
    <Nav displayContextMenu={displayProfileMenu}>
      <ul>
        <MenuItem onClick={toSettings}>Settings</MenuItem>
        <MenuDivider />
        <MenuItem onClick={logoutOnServer}>Log out</MenuItem>
      </ul>
    </Nav>
  );
}

const mapDispatchToProps = {
  logoutOnServer
};

export default connect(null, mapDispatchToProps)(ProfileMenuList);
