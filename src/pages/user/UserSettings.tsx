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
import React, { useEffect } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { NavLink, Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

import {
  ContentColumn,
  SettingsPageContainer,
  SidePanel,
  SidePanelHeader,
  SidePanelLink,
  SidePanelItemIcon,
  SidePanelHeaderIcon,
  SidePanelItemLabel,
  SplitLayout
} from "../../molecules/SettingsPageContainer";

import ProfilePage from "./Profile";

import { generateMediaQuery } from "../../util/mediaQuery";
//import ManageRoles from "./ManageRoles";
//import { useUserProfileContext } from "../stores/meProfile";
import { Permission } from "../../api";
import PersonalAccountKeyManagement from "./PersonalAccountKeyManagement";

function UserSettingsPage() {
  return (
    <SettingsPageContainer>
      <SplitLayout>
        <SidePanel>
          <ul>
            <SidePanelHeader>
              <SidePanelHeaderIcon src="/images/cogs.svg" />
              <SidePanelItemLabel>Profile</SidePanelItemLabel>{" "}
            </SidePanelHeader>
            <li>
              <SidePanelLink to="/me/profile">
                <SidePanelItemIcon src="/images/profile.svg" />
                <SidePanelItemLabel>Overview</SidePanelItemLabel>
              </SidePanelLink>
            </li>
            <li>
              <SidePanelLink to="/me/key">
                <SidePanelItemIcon src="/images/key.svg" />
                <SidePanelItemLabel>Key management </SidePanelItemLabel>
              </SidePanelLink>
            </li>
          </ul>
        </SidePanel>
        <ContentColumn>
          <Switch>
            <Route path="/me/profile" component={ProfilePage} />
            <Route path="/me/key" component={PersonalAccountKeyManagement} />
            <Redirect to="/me" />
          </Switch>
        </ContentColumn>
      </SplitLayout>
    </SettingsPageContainer>
  );
}

export default UserSettingsPage;
