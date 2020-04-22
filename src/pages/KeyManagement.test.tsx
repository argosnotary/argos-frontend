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
import KeyManagement, {
  CreateKeyButton,
  KeyManagementModal
} from "./KeyManagement";
import { waitFor } from "@testing-library/dom";
import PasswordView from "../atoms/PasswordView";
import { ModalButton } from "../atoms/Modal";
const mock = new MockAdapter(Axios);
const mockUrl = "/api/personalaccount/me/key";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  })
}));

jest.mock("../security", () => ({
  ...jest.requireActual("../security"),
  generateKey: () => ({
    push: jest.fn().mockReturnValue({
      keys: {
        encryptedPrivateKey: "encryptedPrivateKey",
        keyId:
          "b154f8515d1097e553a6592c3329722fd447d53626b5fc72f3255dfa37896268",
        publicKey: "puKey"
      },
      password: "ASwBaq5GkamoRq"
    })
  })
}));

const configureGetKeyMockSuccess = () => {
  mock.onGet(mockUrl).reply(200, {
    keyId: "keyid",
    publicKey: "publicKey",
    encryptedPrivateKey: "privateKey"
  });
};

const configureGetKeyMockNotFound = () => {
  mock.onGet(mockUrl).reply(404);
};

const configureCreatekeyMockSuccess = () => {
  mock.onPost(mockUrl).reply(200, {
    keyId: "keyiddnew",
    publicKey: "publicKednew",
    encryptedPrivateKey: "privateKeynew"
  });
};

const createRoot = () => {
  return mount(
    <ThemeProvider theme={theme}>
      <KeyManagement />
    </ThemeProvider>
  );
};

const simulateCreateKeyClick = async (root: any) => {
  root
    .find(CreateKeyButton)
    .at(0)
    .simulate("click");
};

const waitForCreateKeyButton = async (root: any) => {
  await waitFor(() =>
    expect(root.find(CreateKeyButton).length >= 1).toBe(true)
  );
};

const createFixtureForKeyManagementModalView = async (root: any) => {
  await waitForCreateKeyButton(root);
  await simulateCreateKeyClick(root);
  await waitFor(() => {
    root.update();
    expect(root.find(KeyManagementModal).length >= 1).toBe(true);
  });
};

it("when key is present it should display keycontainer", async () => {
  configureGetKeyMockSuccess();
  const root = createRoot();
  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();
      expect(root.find(KeyManagement)).toMatchSnapshot();
    })
  );
});

it("when no key is present it should display warning message", async () => {
  configureGetKeyMockNotFound();
  const root = createRoot();
  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();
      expect(root.find(KeyManagement)).toMatchSnapshot();
    })
  );
});

it("when create key is clicked and no key is present it should display password generated window", async () => {
  configureGetKeyMockNotFound();
  configureCreatekeyMockSuccess();
  const root = createRoot();
  await act(async () => {
    await createFixtureForKeyManagementModalView(root);
    await waitFor(() => {
      root.update();
      expect(root.find(PasswordView).length >= 1).toBe(true);
    });
    expect(root.find(KeyManagement)).toMatchSnapshot();
  });
});

it("when create key is clicked and key is present it should display create new key window ", async () => {
  configureGetKeyMockSuccess();
  const root = createRoot();
  await act(async () => {
    await createFixtureForKeyManagementModalView(root);
    expect(root.find(KeyManagement)).toMatchSnapshot();
  });
});

it("when Continue is clicked on modal window it should show password view modal window", async () => {
  configureGetKeyMockSuccess();
  configureCreatekeyMockSuccess();
  const root = createRoot();
  await act(async () => {
    await createFixtureForKeyManagementModalView(root);
    root
      .find(ModalButton)
      .at(1)
      .simulate("click");
    await waitFor(() => {
      root.update();
      expect(root.find(PasswordView).length >= 1).toBe(true);
    });
    expect(root.find(KeyManagement)).toMatchSnapshot();
  });
});

it("when Close is clicked on modal window it should close modal window", async () => {
  configureGetKeyMockSuccess();
  const root = createRoot();
  await act(async () => {
    await createFixtureForKeyManagementModalView(root);
    root
      .find(ModalButton)
      .at(0)
      .simulate("click");

    await waitFor(() => {
      root.update();
      expect(root.find(KeyManagementModal).length >= 1).toBe(false);
    });
    expect(root.find(KeyManagement)).toMatchSnapshot();
  });
});
