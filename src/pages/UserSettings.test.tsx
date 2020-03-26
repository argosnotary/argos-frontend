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

import UserSettings from "./UserSettings";
import MockAdapter from "axios-mock-adapter";
import Axios from "axios";
import { ThemeProvider } from "styled-components";
import theme from "../theme/base.json";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";

const mock = new MockAdapter(Axios);
const mockUrl = "/api/personalaccount/me";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  }),
  useRouteMatch: () => ({ url: "/" })
}));

it("renders with public menu", async () => {
  mock.onGet(mockUrl).reply(200, {
    id: "a94cb614-e86e-4c52-ae1e-fc2f2cc0fffe",
    name: "Luke Skywalker",
    email: "luke@skywalker.imp",
    roles: [
      {
        id: "16dbaebb-815d-461e-993a-bdfdced6350b",
        name: "jedi",
        permissions: [
          "READ",
          "LOCAL_PERMISSION_EDIT",
          "TREE_EDIT",
          "VERIFY",
          "ASSIGN_ROLE"
        ]
      }
    ]
  });

  const root = mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter keyLength={0}>
        <UserSettings />
      </MemoryRouter>
    </ThemeProvider>
  );

  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();

      expect(root.find(UserSettings)).toMatchSnapshot();
    })
  );
});

it("renders with admin only menu", async () => {
  mock.onGet(mockUrl).reply(200, {
    id: "a94cb614-e86e-4c52-ae1e-fc2f2cc0fffe",
    name: "Luke Skywalker",
    email: "luke@skywalker.imp",
    roles: [
      {
        id: "16dbaebb-815d-461e-993a-bdfdced6350b",
        name: "administrator",
        permissions: [
          "READ",
          "LOCAL_PERMISSION_EDIT",
          "TREE_EDIT",
          "VERIFY",
          "ASSIGN_ROLE"
        ]
      }
    ]
  });

  const root = mount(
    <ThemeProvider theme={theme}>
      <MemoryRouter keyLength={0}>
        <UserSettings />
      </MemoryRouter>
    </ThemeProvider>
  );

  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();

      expect(root.find(UserSettings)).toMatchSnapshot();
    })
  );
});
