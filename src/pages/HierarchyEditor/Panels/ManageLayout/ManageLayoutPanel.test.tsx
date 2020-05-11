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
import { mount, ReactWrapper } from "enzyme";

import MockAdapter from "axios-mock-adapter";
import Axios from "axios";
import { ThemeProvider } from "styled-components";
import theme from "../../../../theme/base.json";
import { act } from "react-dom/test-utils";
import ManageLayoutPanel from "./ManageLayoutPanel";
import { FormPermissions } from "../../../../types/FormPermission";
import { ILayoutMetaBlock } from "../../../../interfaces/ILayout";
import TextArea from "../../../../atoms/TextArea";
import { waitFor } from "@testing-library/dom";
import { Modal } from "../../../../atoms/Modal";
import GenericForm from "../../../../organisms/GenericForm";
import IPersonalAccountKeyPair from "../../../../interfaces/IPersonalAccountKeyPair";
import { NoCryptoWarning } from "../../../../molecules/NoCryptoWarning";
import { cryptoAvailable } from "../../../../security";
import * as layoutService from "../../LayoutService";
import { Notification } from "../../../../molecules/NotificationsList";
import { HierarchyEditorPaneActionTypes } from "../../../../stores/hierarchyEditorStore";
import { StateContext } from "../../HierarchyEditor";

const mock = new MockAdapter(Axios);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  })
}));

jest.mock("../../../../security", () => ({
  cryptoAvailable: jest.fn()
}));

function mockLayoutMetaBlock(): ILayoutMetaBlock {
  return {
    signatures: [
      {
        keyId: "keyId",
        signature: "signature"
      }
    ],
    layout: {
      authorizedKeyIds: [],
      expectedEndProducts: [],
      keys: [],
      layoutSegments: []
    }
  };
}

jest
  .spyOn(layoutService, "signLayout")
  .mockResolvedValue(mockLayoutMetaBlock());

const addItem = jest.fn();

function createComponent() {
  const state = {
    firstPanelView: HierarchyEditorPaneActionTypes.NONE,
    nodeReferenceId: "supplyChainId",
    nodeParentId: "",
    breadcrumb: "label / ",
    selectedNodeName: "layout",
    panePermission: FormPermissions.EDIT
  };

  return mount(
    <ThemeProvider theme={theme}>
      <StateContext.Provider value={[state, addItem]}>
        <ManageLayoutPanel />
      </StateContext.Provider>
    </ThemeProvider>
  );
}

it("renders correctly with non existing layout", async () => {
  mock.reset();
  mock.onGet("/api/supplychain/supplyChainId/layout").reply(404);
  (cryptoAvailable as jest.Mock).mockReturnValue(true);
  const root = createComponent();

  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();

      expect(root.find(ManageLayoutPanel)).toMatchSnapshot();
    })
  );
});

it("renders correctly with existing layout", async () => {
  mock.reset();
  (cryptoAvailable as jest.Mock).mockReturnValue(true);
  const layoutMetaBlock: ILayoutMetaBlock = {
    signatures: [],
    layout: {
      authorizedKeyIds: [],
      expectedEndProducts: [],
      keys: [],
      layoutSegments: []
    }
  };

  mock
    .onGet("/api/supplychain/supplyChainId/layout")
    .reply(200, layoutMetaBlock);
  const root = createComponent();

  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();

      expect(root.find(ManageLayoutPanel)).toMatchSnapshot();
    })
  );
});

it("renders correctly with existing layout without crypto support", async () => {
  mock.reset();
  (cryptoAvailable as jest.Mock).mockReturnValue(false);
  const layoutMetaBlock: ILayoutMetaBlock = {
    signatures: [],
    layout: {
      authorizedKeyIds: [],
      expectedEndProducts: [],
      keys: [],
      layoutSegments: []
    }
  };

  mock
    .onGet("/api/supplychain/supplyChainId/layout")
    .reply(200, layoutMetaBlock);
  const root = createComponent();

  await act(() =>
    new Promise(resolve => setImmediate(resolve)).then(() => {
      root.update();

      expect(root.find(NoCryptoWarning)).toMatchSnapshot();
    })
  );
});

const updateField = (wrapper: ReactWrapper<any>, name: string, value: any) => {
  wrapper.simulate("input", {
    persist: () => {},
    target: {
      name,
      value
    }
  });
  wrapper.simulate("change", {
    persist: () => {},
    target: {
      name,
      value
    }
  });
};

it("validates a faulty layout and returns errors", async () => {
  mock.reset();

  mock.onGet("/api/supplychain/supplyChainId/layout").reply(404);
  mock.onPost("/api/supplychain/supplyChainId/layout/validate").reply(400, {
    messages: [
      {
        field: "authorizedKeyIds",
        type: "DATA_INPUT",
        message: "size must be between 1 and 2147483647"
      },
      {
        field: "expectedEndProducts",
        type: "DATA_INPUT",
        message: "size must be between 1 and 2147483647"
      },
      {
        field: "keys",
        type: "DATA_INPUT",
        message: "size must be between 1 and 2147483647"
      },
      {
        field: "layoutSegments",
        type: "DATA_INPUT",
        message: "size must be between 1 and 2147483647"
      }
    ]
  });

  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(root.find(GenericForm).props().isLoading).toBe(false);
    });

    updateField(
      root.find(TextArea).first(),
      "layout",
      JSON.stringify({
        keys: [],
        authorizedKeyIds: [],
        expectedEndProducts: [],
        layoutSegments: []
      })
    );

    root.find('form[data-testhook-id="layout-json-form"]').simulate("submit");

    await waitFor(() => expect(root.find(Notification).length == 4).toBe(true));
    expect(root.find(ManageLayoutPanel)).toMatchSnapshot();
  });
});

it("sign layout happy flow", async () => {
  mock.reset();
  (cryptoAvailable as jest.Mock).mockReturnValue(true);

  mock.onGet("/api/supplychain/supplyChainId/layout").reply(404);

  const key: IPersonalAccountKeyPair = {
    encryptedPrivateKey: "encryptedPrivateKey",
    keyId: "keyId",
    publicKey: "publicKey"
  };

  mock.onGet("/api/personalaccount/me/key").reply(200, key);

  mock.onPost("/api/supplychain/supplyChainId/layout").reply(200);
  mock.onPost("/api/supplychain/supplyChainId/layout/validate").reply(200);

  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(root.find(GenericForm).props().isLoading).toBe(false);
    });

    updateField(
      root.find(TextArea).first(),
      "layout",
      JSON.stringify({
        keys: [],
        authorizedKeyIds: [],
        expectedEndProducts: [],
        layoutSegments: []
      })
    );

    root.find('form[data-testhook-id="layout-json-form"]').simulate("submit");

    await waitFor(() => {
      root.update();
      expect(root.find(Modal).length >= 1).toBe(true);
    });

    expect(root.find(ManageLayoutPanel)).toMatchSnapshot();
    updateField(
      root.find('input[name="passphrase"]').first(),
      "passphrase",
      "password"
    );
    root
      .find('form[data-testhook-id="passphrase-form"]')
      .first()
      .simulate("submit");

    await waitFor(() => expect(mock.history.get.length).toBe(2));
    await waitFor(() => expect(mock.history.post.length).toBe(2));

    expect(addItem.mock.calls[0][0]).toEqual({ type: "RESET_PANE" });
    expect(mock.history.post[1].data).toBe(
      JSON.stringify(mockLayoutMetaBlock())
    );
  });
});
