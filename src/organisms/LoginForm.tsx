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
import React from "react";

import styled from "styled-components";
import { AnchorButton } from "../atoms/Button";

const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  margin: 10% auto;
  width: 20rem;
  box-shadow: 0 3px 20px 0px rgba(0, 0, 0, 0.1);
  padding: 1.75rem 2rem 2rem;
`;

const LoginFormHeader = styled.img`
  height: 4.25rem;
  margin: 2rem auto 4rem;
  display: flex;
  max-width: 100%;
`;

const LoginButton = styled(AnchorButton)`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  margin: 1rem 0;
  font-size: 1rem;
  text-decoration: none;
`;

interface ILoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  return (
    <LoginFormContainer>
      <LoginFormHeader src="images/logo.svg" />
      <LoginButton
        href={
          "http://localhost:8080/oauth2/authorize/azure?redirect_uri=http://localhost:3000/authenticated"
        }
      >
        Login with Azure
      </LoginButton>
    </LoginFormContainer>
  );
};

export default LoginForm;
