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
import React, { ReactNode } from "react";
import { Redirect, Route } from "react-router-dom";
import useToken from "../hooks/useToken";

interface IPrivateRouteProps {
  children: ReactNode;
  path: string;
}

const PrivateRoute = ({ children, ...rest }: IPrivateRouteProps) => {
  const [token] = useToken();

  return (
    <Route
      {...rest}
      // tslint:disable-next-line: jsx-no-lambda
      render={({ location }) =>
        token && token.length > 0 ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
