/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
import styled from "styled-components";

import LoginForm from "../organisms/LoginForm";
import { PROFILE_STATE, useUserProfileContext } from "../stores/UserProfile";

const LoginPageContainer = styled.section`
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.loginPage.bgColor};
`;

const LoginPage: React.FC = () => {
  const userProfileContext = useUserProfileContext();
  if (userProfileContext.state === PROFILE_STATE.LOGGED_OUT) {
    return (
      <LoginPageContainer>
        <LoginForm />
      </LoginPageContainer>
    );
  } else {
    return null;
  }
};

export default LoginPage;
