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
/* tslint:disable */
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation
} from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/Home";
import LoginPage from "../pages/Login";
import UserSettingsPage from "../pages/UserSettings";

interface IAuthenticationForwarderProps {
  token: string;
  setToken: (token: string) => void;
}

const AuthenticationForwarder: React.FC<IAuthenticationForwarderProps> = ({
  setToken
}) => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  useEffect(() => {
    const queryToken = query.get("token");

    if (queryToken) {
      localStorage.setItem("token", queryToken);
      setToken(queryToken);
    }
  });

  return <Redirect to="/dashboard" />;
};

const Logout: React.FC<IAuthenticationForwarderProps> = ({ setToken }) => {
  useEffect(() => {
    localStorage.removeItem("token");
    setToken("");
  });

  return <Redirect to="/login" />;
};

const Routes: React.FC = () => {
  const [token, setToken] = useState("");

  return (
    <Router>
      <Switch>
        <Route exact={true} path="/">
          <HomePage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/logout">
          <Logout token={token} setToken={setToken} />
        </Route>
        <Route path="/authenticated">
          <AuthenticationForwarder token={token} setToken={setToken} />
        </Route>
        {localStorage.getItem("token") ? (
          <>
            <Route path="/dashboard">
              <DashboardPage />
            </Route>
            <Route path="/settings">
              <UserSettingsPage />
            </Route>
          </>
        ) : (
          <Redirect to={"/login"} />
        )}
      </Switch>
    </Router>
  );
};

export default Routes;
