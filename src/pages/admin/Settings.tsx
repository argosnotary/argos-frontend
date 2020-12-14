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
import React from "react";
import { Route, Switch } from "react-router-dom";

import ManageRoles from "./ManageRoles";
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

const UserSettingsPage = () => {
  return (
    <SettingsPageContainer>
      <SplitLayout>
        <SidePanel>
          <ul>
            <SidePanelHeader>
              <SidePanelHeaderIcon src="/images/cogs.svg" />
              <SidePanelItemLabel>Settings</SidePanelItemLabel>{" "}
            </SidePanelHeader>
            <li>
              <SidePanelLink to="/settings/manage-roles">
                <SidePanelItemIcon src="/images/lock-stripes.svg" />
                <SidePanelItemLabel>Manage Roles</SidePanelItemLabel>
              </SidePanelLink>
            </li>
          </ul>
        </SidePanel>
        <ContentColumn>
          <Route path="/settings/manage-roles" component={ManageRoles} />;
        </ContentColumn>
      </SplitLayout>
    </SettingsPageContainer>
  );
};

export default UserSettingsPage;
