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
import ManageRoles from "./ManageRoles";
import { waitFor } from "@testing-library/dom";
import UserAuthorizationComponent from "../molecules/UserAuthorizationComponent";

const mock = new MockAdapter(Axios);
const mockPersonalAccountApiUrl = "/api/personalaccount";
const mockRolesApiUrl = "/api/permissions/global/role";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  })
}));

it("renders correctly", async () => {
  mock.onGet(mockRolesApiUrl).reply(200, [
    {
      id: "fe9fe1b5-5eff-4b93-8fa4-1edd743e1726",
      name: "administrator",
      permissions: [
        "READ",
        "LOCAL_PERMISSION_EDIT",
        "TREE_EDIT",
        "VERIFY",
        "ASSIGN_ROLE"
      ]
    }
  ]);

  mock.onGet(mockPersonalAccountApiUrl).reply(200, [
    {
      id: "06125d50-b0e6-4015-8b8b-6a72eb16e929",
      name: "Luke Skywalker",
      email: "luke@skywalker.imp"
    }
  ]);

  const root = mount(
    <ThemeProvider theme={theme}>
      <ManageRoles />
    </ThemeProvider>
  );

  await act(async () => {
    await waitFor(() => {
      root.update();

      expect(root.find(UserAuthorizationComponent).length > 0).toBe(true);
    });

    expect(root.find(ManageRoles)).toMatchSnapshot();
  });
});
