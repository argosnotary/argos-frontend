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
import React from "react";
import { mount } from "enzyme";

import MockAdapter from "axios-mock-adapter";
import Axios from "axios";
import { ThemeProvider } from "styled-components";
import theme from "../../theme/base.json";
import { act } from "react-dom/test-utils";
import LoginFormContainer from "./LoginFormContainer";
import { OAuthProvider } from "../../api/api";

const mock = new MockAdapter(Axios);

jest.mock("react-router-dom", () => {
    return {
        useHistory: jest.fn()
    };
});

it("renders correctly", async () => {
    const providers: Array<OAuthProvider> = [
        {
            providerName: "provider1",
            displayName: "name1"
        },
        {
            providerName: "provider2",
            displayName: "name2",
            iconUrl: "http://localhost/icon.svg"
        }
    ];

    mock.onGet("/api/oauthprovider").reply(200, providers);

    const root = mount(
        <ThemeProvider theme={theme}>
            <LoginFormContainer />
        </ThemeProvider>
    );

    await act(() =>
        new Promise(resolve => setImmediate(resolve)).then(() => {
            root.update();
            expect(root.find(LoginFormContainer)).toMatchSnapshot();
        })
    );
});

it("renders correctly error", async () => {
    mock.onGet("/api/oauthprovider").reply(404);

    const root = mount(
        <ThemeProvider theme={theme}>
            <LoginFormContainer />
        </ThemeProvider>
    );

    await act(() =>
        new Promise(resolve => setImmediate(resolve)).then(() => {
            root.update();
            expect(root.find(LoginFormContainer)).toMatchSnapshot();
        })
    );
});
