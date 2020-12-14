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
import React, { useState } from "react";
import styled from "styled-components";
import ProfileMenuList from "./ProfileMenuList";

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

function AvatarMenuRoot() {
  const [displayProfileMenu, setDiplayProfileMenu] = useState(false);
  const enableProfileMenuDisplay = () => {
    setDiplayProfileMenu(true);
  };

  const disableProfileMenuDisplay = () => {
    setDiplayProfileMenu(false);
  };

  return (
    <AvatarContainer>
      {displayProfileMenu ? <TransparentOverlay onClick={disableProfileMenuDisplay} /> : null}
      <Avatar onClick={enableProfileMenuDisplay} />
      <ProfileMenuList displayProfileMenu={displayProfileMenu} setDisplayProfileMenu={setDiplayProfileMenu} />
    </AvatarContainer>
  );
}

export default AvatarMenuRoot;
