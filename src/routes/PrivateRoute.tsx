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
import React, { ReactNode } from "react";
import { Route } from "react-router-dom";
import { PROFILE_STATE, useUserProfileContext } from "../stores/UserProfile";

interface IPrivateRouteProps {
  children: ReactNode;
  path: string;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({
  children,
  path
}: IPrivateRouteProps) => {
  const userProfile = useUserProfileContext();
  if (userProfile.state === PROFILE_STATE.READY) {
    return <Route path={path}>{children}</Route>;
  } else {
    return null;
  }
};

export default PrivateRoute;
