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

import React from "react";
import { mount } from "enzyme";

import MockAdapter from "axios-mock-adapter";
import Axios from "axios";
import { ThemeProvider } from "styled-components";
import theme from "../theme/base.json";
import { act } from "react-dom/test-utils";
import LoginForm, { IProvider } from "./LoginForm";

const mock = new MockAdapter(Axios);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  })
}));

it("renders correctly", async () => {
  const providers: Array<IProvider> = [
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
      <LoginForm />
    </ThemeProvider>
  );

  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();
      expect(root.find(LoginForm)).toMatchSnapshot();
    })
  );
});

it("renders correctly error", async () => {
  mock.onGet("/api/oauthprovider").reply(404);

  const root = mount(
    <ThemeProvider theme={theme}>
      <LoginForm />
    </ThemeProvider>
  );

  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();
      expect(root.find(LoginForm)).toMatchSnapshot();
    })
  );
});
