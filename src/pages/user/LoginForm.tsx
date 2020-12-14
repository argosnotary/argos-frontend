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
import styled from "styled-components";
import { ConnectionErrorMessage } from "../../atoms/ConnectionError";
import { OAuthProvider } from "../../api/api";

import { AnchorButton } from "../../atoms/Button";

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

const LoginButton = styled(AnchorButton)`
    border: 1px solid ${props => props.theme.loginForm.buttonBorderColor};
    color: ${props => props.theme.loginForm.buttonTextColor};

    &:hover {
        border-left: 4px solid ${props => props.theme.loginForm.buttonHoverHighlightColor};
    }
`;

const LoginFormHeader = styled.img`
    height: 4.25rem;
    margin: 2rem auto 4rem;
    display: flex;
    max-width: 100%;
`;

const StyledForm = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${props => props.theme.loginForm.bgColor};
    margin: 10% auto;
    width: 20rem;
    box-shadow: 0 3px 20px 0px rgba(0, 0, 0, 0.1);
    padding: 1.75rem 2rem 2rem;
`;

interface LoginProvidersProps {
    showError: boolean;
    providers: OAuthProvider[];
}

function LoginFormContainer(props: LoginProvidersProps): JSX.Element {
    return (
        <StyledForm>
            <LoginFormHeader src="images/logo.svg" />
            {props.showError ? <ConnectionErrorMessage>Connection error try again later</ConnectionErrorMessage> : null}
            {props.providers.map((provider, index) => {
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
                        <AuthProviderLabel>Login with {provider.displayName}</AuthProviderLabel>
                    </LoginButton>
                );
            })}
        </StyledForm>
    );
}

export default LoginFormContainer;
