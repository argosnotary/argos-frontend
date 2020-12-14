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
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import Header from "./pages/header/Header";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/user/LoginPage";
import { handleAuthenticationToken } from "./pages/user/Authenticated";
import PageNotFoundPage from "./pages/PageNotFoundPage";
import Settings from "./pages/settings/Settings";
import PrivateRoute from "./pages/user/PrivateRoute";
import { isAdministrator } from "./util/authorization";
import ManageServiceAccount from "./pages/serviceaccount/ManageServiceAccount";
import ManageSupplyChain from "./pages/supplychain/ManageSupplyChain";
import Approve from "./pages/approval/Approve";
import Release from "./pages/release/Release";
import ManageLabelPage from "./pages/label/ManageLabelPage";
import TreeExplorerPage from "./pages/explorer/TreeExplorerPage";
import UserSettingsPage from "./pages/user/UserSettings";

const AppContainer = styled.section`
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.appContainer.bgColor};
`;

function App(props: any) {
  const { token, profile } = props;
  return (
    <>
      <Header />
      <AppContainer>
        <Switch>
          <Route exact={true} path="/">
            <HomePage />
          </Route>
          <Route path="/login">{token && token.token ? <Redirect to="/" /> : <LoginPage />}</Route>
          <Route path="/authenticated">
            {handleAuthenticationToken()}
            <Redirect to="/" />
          </Route>
          {isAdministrator(profile.roles) ? <PrivateRoute path="/settings" component={Settings} /> : null}
          <PrivateRoute path="/explorer" component={TreeExplorerPage} />
          <PrivateRoute path="/label" component={ManageLabelPage}></PrivateRoute>
          <PrivateRoute path="/serviceaccount" component={ManageServiceAccount} />
          <PrivateRoute path="/supplychain" component={ManageSupplyChain} />
          <PrivateRoute path="/approval" component={Approve} />
          <PrivateRoute path="/release" component={Release} />
          <PrivateRoute path="/me" component={UserSettingsPage} />
          <Route component={PageNotFoundPage} />
        </Switch>
      </AppContainer>
    </>
  );
}

function mapStateToProps(state: any) {
  return {
    token: state.token,
    profile: state.profile
  };
}

export default connect(mapStateToProps)(App);
