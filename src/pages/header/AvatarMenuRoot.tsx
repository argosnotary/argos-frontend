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
import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { ContextmenuItemsProps, ContextMenu } from "../../organisms/ContextMenu";
import { logout } from "../user/tokenSlice";

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

function AvatarMenuRoot(props: any) {
  const { logout } = props;
  const [displayProfileMenu, setDisplayProfileMenu] = useState(false);

  const toSettings = () => {
    setDisplayProfileMenu(false);
  };

  const logoutHandle = () => {
    setDisplayProfileMenu(false);
    logout();
  };

  const items: ContextmenuItemsProps[] = [
    {
      linkPath: "/me/overview",
      labelText: "Settings",
      handleOnClick: toSettings
    },
    {
      linkPath: "/",
      labelText: "Log out",
      handleOnClick: logoutHandle
    }
  ];

  return (
    <AvatarContainer>
      <Avatar
        onClick={() => {
          setDisplayProfileMenu(true);
        }}
      />
      {displayProfileMenu ? (
        <ContextMenu
          disabled={false}
          displayMenu={displayProfileMenu}
          setDisplayMenu={setDisplayProfileMenu}
          items={items}
        />
      ) : null}
    </AvatarContainer>
  );
}

const mapDispatchToProps = {
  logout
};

export default connect(null, mapDispatchToProps)(AvatarMenuRoot);
