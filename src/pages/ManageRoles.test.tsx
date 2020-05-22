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
import RoleAuthorizationComponent from "../molecules/RoleAuthorizationComponent";
import IPersonalAccount from "../interfaces/IPersonalAccount";
import {
  PROFILE_STATE,
  UserProfile,
  UserProfileContext
} from "../stores/UserProfile";
import { CollapseButton } from "../atoms/CollapsibleContainer";
import DataCheckbox from "../atoms/DataCheckbox";

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
  const personalAccount: IPersonalAccount = {
    id: "06125d50-b0e6-4015-8b8b-6a72eb16e929",
    name: "Luke Skywalker",
    email: "luke@skywalker.imp",
    roles: [
      {
        id: "16dbaebb-815d-461e-993a-bdfdced6350b",
        name: "administrator",
        permissions: []
      }
    ]
  };

  const userRole = {
    id: "fe9fe1b5-5eff-4b93-8fa4-1edd743e1725",
    name: "user",
    permissions: ["PERSONAL_ACCOUNT_READ"]
  };
  const adminRole = {
    id: "fe9fe1b5-5eff-4b93-8fa4-1edd743e1726",
    name: "administrator",
    permissions: []
  };
  mock.onGet(mockRolesApiUrl).reply(200, [adminRole, userRole]);

  const luke = {
    id: "06125d50-b0e6-4015-8b8b-6a72eb16e929",
    name: "Luke Skywalker"
  };

  const anikan = {
    id: "06125d50-b0e6-4015-8b8b-6a72eb16e921",
    name: "Anikan Skywalker"
  };

  mock
    .onGet(mockPersonalAccountApiUrl, { params: { roleName: "administrator" } })
    .reply(200, [luke]);

  mock
    .onGet(mockPersonalAccountApiUrl, { params: { roleName: "user" } })
    .reply(200, [luke, anikan]);

  mock
    .onGet("/api/personalaccount/" + luke.id)
    .reply(200, { id: luke.id, name: luke.name, roles: [adminRole, userRole] });

  mock
    .onGet("/api/personalaccount/" + anikan.id)
    .reply(200, { id: anikan.id, name: anikan.name, roles: [userRole] });

  mock
    .onPut("/api/personalaccount/" + luke.id + "/role")
    .reply(200, { id: luke.id, name: luke.name, roles: [adminRole] });

  const root = mount(
    <ThemeProvider theme={theme}>
      <UserProfileContext.Provider
        value={{
          profile: new UserProfile(personalAccount),
          setToken: jest.fn(),
          state: PROFILE_STATE.READY,
          token: "token",
          setUserProfile: jest.fn()
        }}>
        <ManageRoles />
      </UserProfileContext.Provider>
    </ThemeProvider>
  );

  await act(async () => {
    await waitFor(() => {
      root.update();
      expect(root.find(RoleAuthorizationComponent).length > 0).toBe(true);
    });

    await waitFor(() => {
      root
        .find(CollapseButton)
        .at(0)
        .simulate("click");
      expect(root.find(DataCheckbox).length >= 2).toBe(true);
    });

    await waitFor(() => {
      root
        .find(CollapseButton)
        .at(1)
        .simulate("click");
      expect(root.find(DataCheckbox).length >= 4).toBe(true);
    });

    expect(
      root
        .find(DataCheckbox)
        .at(0)
        .props().initialCheckedValue
    ).toEqual(true);
    expect(
      root
        .find(DataCheckbox)
        .at(1)
        .props().initialCheckedValue
    ).toEqual(true);
    expect(
      root
        .find(DataCheckbox)
        .at(2)
        .props().initialCheckedValue
    ).toEqual(false);
    expect(
      root
        .find(DataCheckbox)
        .at(3)
        .props().initialCheckedValue
    ).toEqual(true);

    root
      .find(DataCheckbox)
      .at(1)
      .simulate("change");
    await waitFor(() => {
      expect(mock.history.put.length).toBe(1);
    });

    expect(mock.history.put[0].data).toBe(
      JSON.stringify(["administrator", "user"])
    );
    expect(root.find(ManageRoles)).toMatchSnapshot();
  });
});
