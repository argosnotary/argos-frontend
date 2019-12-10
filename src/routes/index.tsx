import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/Login";

const Routes: React.FC = () => (
  <Router>
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>
    </Switch>
  </Router>
);

export default Routes;
