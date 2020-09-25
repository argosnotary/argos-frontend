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
import React, { useEffect, useState } from "react";

import { AnchorButton } from "../atoms/Button";
import styled from "styled-components";
import axios, { AxiosRequestConfig } from "axios";
import { ConnectionErrorMessage } from "../atoms/ConnectionError";

const AuthProviderImage = styled.img`
  width: 1.5rem;
`;

const AuthProviderLabel = styled.span``;

const AuthLabelAndImageSeparator = styled.span`
  border-right: 1px solid ${props => props.theme.loginForm.separatorColor};
  width: 1px;
  height: 1rem;
  margin: 0 1rem;
`;

const LoginFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.loginForm.bgColor};
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
  justify-content: left;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  font-size: 1rem;
  text-decoration: none;
  border: 1px solid ${props => props.theme.loginForm.buttonBorderColor};
  background: transparent;
  color: ${props => props.theme.loginForm.buttonTextColor};
  min-height: 3.25rem;

  &:hover {
    background: transparent;
    border-left: 4px solid
      ${props => props.theme.loginForm.buttonHoverHighlightColor};
  }
`;

export interface IProvider {
  providerName: string;
  displayName: string;
  iconUrl?: string;
}

const LoginForm: React.FC = () => {
  const [providers, setProviders] = useState<Array<IProvider>>([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const requestConfig: AxiosRequestConfig = {
      method: "get",
      cancelToken: source.token
    };

    axios("/api/oauthprovider", requestConfig)
      .then((response: any) => {
        setProviders(response.data);
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          setShowError(true);
        }
      });

    return () => {
      source.cancel();
    };
  }, []);

  return (
    <LoginFormContainer>
      <LoginFormHeader src="images/logo.svg" />
      {showError ? (
        <ConnectionErrorMessage>
          Connection error try again later
        </ConnectionErrorMessage>
      ) : null}
      {providers.map((provider, index) => {
        return (
          <LoginButton
            key={`provider${index}`}
            href={`/api/oauth2/authorize/${provider.providerName}?redirect_uri=/authenticated`}>
            {provider.iconUrl ? (
              <>
                <AuthProviderImage src={provider.iconUrl} />
                <AuthLabelAndImageSeparator />
              </>
            ) : null}
            <AuthProviderLabel>
              Login with {provider.displayName}
            </AuthProviderLabel>
          </LoginButton>
        );
      })}
    </LoginFormContainer>
  );
};

export default LoginForm;
