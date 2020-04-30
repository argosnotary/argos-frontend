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

import React, { useState } from "react";
import styled from "styled-components";

import Navbar from "../molecules/Navbar";
import NavbarContextMenu from "../molecules/NavbarContextMenu";
import { Link } from "react-router-dom";

const AvatarContainer = styled.li`
  position: relative;
`;

const Avatar = styled.div`
  border-radius: 50%;
  border: 1px solid ${props => props.theme.dashboardPage.avatar.borderColor};
  height: 2rem;
  width: 2rem;
  background: url("/images/user.svg");
  padding: 0.2rem;
  box-sizing: border-box;
`;

const TransparentOverlay = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const LinkContainer = styled.li`
  margin: 0 1rem;

  a {
    color: ${props => props.theme.dashboardNavBar.link.textColor};
    padding: 0.5rem;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      background-color: ${props =>
        props.theme.dashboardNavBar.link.hover.bgColor};
    }
  }
`;

const DashboardNavbar = () => {
  const [displayContextMenu, setDisplayContextMenu] = useState(false);
  const enableContextMenuDisplay = () => {
    setDisplayContextMenu(true);
  };

  const disableContextMenuDisplay = () => {
    setDisplayContextMenu(false);
  };

  return (
    <Navbar homeUrl={"/dashboard"}>
      <LinkContainer>
        <Link to={"/edit/layout"}>Supply chains</Link>
      </LinkContainer>
      <AvatarContainer>
        {displayContextMenu ? (
          <TransparentOverlay onClick={disableContextMenuDisplay} />
        ) : null}
        <Avatar onClick={enableContextMenuDisplay} />
        <NavbarContextMenu
          displayContextMenu={displayContextMenu}
          setDisplayContextMenu={setDisplayContextMenu}
        />
      </AvatarContainer>
    </Navbar>
  );
};

export default DashboardNavbar;
