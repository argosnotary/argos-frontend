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
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation
} from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import UserSettingsPage from "../pages/UserSettings";
import { RequestErrorStoreProvider } from "../stores/requestErrorStore";
import HierarchyEditor from "../pages/HierarchyEditor/HierarchyEditor";
import {
  TokenActionType,
  UserProfileStoreProvider,
  useUserProfileContext
} from "../stores/UserProfile";

const AuthenticationForwarder: React.FC = () => {
  const location = useLocation();
  const userProfile = useUserProfileContext();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryToken = query.get("token");
    if (queryToken) {
      userProfile.doTokenAction({
        type: TokenActionType.LOGIN,
        token: queryToken
      });
    } else if (query.get("error")) {
      userProfile.setError(query.get("error"));
      userProfile.doTokenAction({ type: TokenActionType.LOGOUT, token: null });
    } else {
      userProfile.doTokenAction({ type: TokenActionType.LOGOUT, token: null });
    }
  });
  return null;
};

const Routes: React.FC = () => {
  return (
    <Router>
      <UserProfileStoreProvider>
        <Switch>
          <Route exact={true} path="/">
            <HomePage />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/authenticated">
            <AuthenticationForwarder />
          </Route>
          <RequestErrorStoreProvider>
            <PrivateRoute path="/dashboard">
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </PrivateRoute>
            <PrivateRoute path="/settings">
              <DashboardLayout>
                <UserSettingsPage />
              </DashboardLayout>
            </PrivateRoute>
            <PrivateRoute path="/edit/layout">
              <DashboardLayout>
                <HierarchyEditor />
              </DashboardLayout>
            </PrivateRoute>
          </RequestErrorStoreProvider>
        </Switch>
      </UserProfileStoreProvider>
    </Router>
  );
};

export default Routes;
