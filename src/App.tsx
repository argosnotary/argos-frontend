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
import React, { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import styled, { ThemeContext } from "styled-components";

import Header from "./pages/header/Header";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/user/LoginPage";
import { handleAuthenticationToken } from "./pages/user/Authenticated";
import PageNotFoundPage from "./pages/PageNotFoundPage";
import UserSettings from "./pages/user/UserSettings";
import Settings from "./pages/admin/Settings";
import { LoaderIcon } from "./atoms/Icons";

const AppContainer = styled.section`
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.appContainer.bgColor};
`;

function App(props: any) {
  const theme = useContext(ThemeContext);
  const { token } = props;
  return (
    <>
      <Header />
      <AppContainer>
        <Switch>
          <Route exact={true} path="/" component={HomePage} />
          <Route path="/login">{token && token.token ? <Redirect to="/" /> : <LoginPage />}</Route>
          <Route path="/authenticated">
            {handleAuthenticationToken()}
            <Redirect to="/" />
          </Route>
          <Route path="/settings" component={Settings} />
          <Route path="/me" component={UserSettings} />
          <Route component={PageNotFoundPage} />
        </Switch>
      </AppContainer>
    </>
  );
}

function mapStateToProps(state: any) {
  return {
    token: state.token
  };
}

export default connect(mapStateToProps)(App);
