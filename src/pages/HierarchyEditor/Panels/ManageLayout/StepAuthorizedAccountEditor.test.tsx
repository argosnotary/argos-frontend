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
import React from "react";
import { mount, ReactWrapper } from "enzyme";

import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/dom";
import RuleEditor from "./RuleEditor";
import {
  DetailsPanelType,
  ILayoutEditorStoreContext,
  LayoutEditorStoreContext
} from "../../../../stores/LayoutEditorStore";
import {
  ILayout,
  IRule,
  IStep,
  RuleDestinationTypeEnum,
  RuleRuleTypeEnum
} from "../../../../interfaces/ILayout";
import StepAuthorizedAccountEditor, {
  AccountStatusLabel
} from "./StepAuthorizedAccountEditor";
import HierarchyEditorTestWrapper from "../../../../test/utils";
import MockAdapter from "axios-mock-adapter";
import Axios from "axios";
import { SearchResultEntry } from "../../../../atoms/SearchInput";

const mock = new MockAdapter(Axios);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  })
}));

const dispatch = jest.fn();

const editorStoreContext: ILayoutEditorStoreContext = {
  state: {
    layout: {} as ILayout,
    detailPanelMode: DetailsPanelType.LAYOUT_DETAILS,
    approvalConfigs: [],
    showSigningDialog: false,
    loading: false,
    activeEditLayoutElement: undefined,
    selectedLayoutElement: {
      step: {
        name: "step1",
        authorizedKeyIds: ["activeKey", "inactiveKey", "deletedKey"]
      } as IStep
    }
  },
  dispatch: dispatch
} as ILayoutEditorStoreContext;

const editorStoreContextWithoutIds: ILayoutEditorStoreContext = {
  state: {
    layout: {} as ILayout,
    detailPanelMode: DetailsPanelType.LAYOUT_DETAILS,
    approvalConfigs: [],
    showSigningDialog: false,
    loading: false,
    activeEditLayoutElement: undefined,
    selectedLayoutElement: {
      step: {
        name: "step1"
      } as IStep
    }
  },
  dispatch: dispatch
} as ILayoutEditorStoreContext;

const addItem = jest.fn();

function createComponent(editorStoreContext: ILayoutEditorStoreContext) {
  return mount(
    <HierarchyEditorTestWrapper mockedDispatch={addItem}>
      <LayoutEditorStoreContext.Provider value={editorStoreContext}>
        <StepAuthorizedAccountEditor />
      </LayoutEditorStoreContext.Provider>
    </HierarchyEditorTestWrapper>
  );
}
const accountStatusList = [
  {
    accountId: "accountId1",
    name: "account1",
    accountType: "PERSONAL_ACCOUNT",
    keyId: "keyId1",
    keyStatus: "ACTIVE"
  },
  {
    accountId: "accountId2",
    name: "account2",
    accountType: "SERVICE_ACCOUNT",
    path: "path/path",
    keyId: "keyId2",
    keyStatus: "INACTIVE"
  },
  {
    keyId: "keyId3",
    keyStatus: "DELETED"
  }
];

it("renders correctly", async () => {
  mock.reset();

  mock
    .onGet("/api/supplychain/supplyChainId/account/key", {
      params: { keyIds: "activeKey,inactiveKey,deletedKey" }
    })
    .reply(200, accountStatusList);

  const root = createComponent(editorStoreContext);

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(root.find(AccountStatusLabel).length).toBe(3);
    });
    expect(root.find(StepAuthorizedAccountEditor)).toMatchSnapshot();
  });
});

it("remove account", async () => {
  mock.reset();

  mock
    .onGet("/api/supplychain/supplyChainId/account/key", {
      params: { keyIds: "activeKey,inactiveKey,deletedKey" }
    })
    .reply(200, accountStatusList);

  const root = createComponent(editorStoreContext);

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(root.find(AccountStatusLabel).length).toBe(3);
    });

    root.find('button[data-testhook-id="delete-key-1"]').simulate("click");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(1);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      publicKey: {
        keyId: "keyId2"
      },
      type: 32
    });
  });
});

it("add personal account", async () => {
  mock.reset();
  dispatch.mockReset();

  mock
    .onGet("/api/supplychain/supplyChainId/account", {
      params: { name: "accountName" }
    })
    .reply(200, [
      {
        accountId: "accountId1",
        name: "accountName",
        accountType: "PERSONAL_ACCOUNT"
      }
    ]);

  mock
    .onGet("/api/personalaccount/accountId1/key")
    .reply(200, { key: "publicKey", id: "keyId" });

  const root = createComponent(editorStoreContextWithoutIds);

  await act(async () => {
    root.find('button[data-testhook-id="add-key"]').simulate("click");

    await waitFor(() => {
      root.update();
      return expect(root.find('input[name="searchinput"]').length).toBe(1);
    });

    updateField(
      root.find('input[name="searchinput"]').first(),
      "searchinput",
      "accountName"
    );

    await waitFor(() => {
      root.update();
      return expect(root.find(SearchResultEntry).length).toBe(1);
    });

    root.find(SearchResultEntry).simulate("click");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(1);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      publicKey: {
        id: "keyId",
        key: "publicKey"
      },
      type: 31
    });
  });
});

it("add service account", async () => {
  mock.reset();
  dispatch.mockReset();

  mock
    .onGet("/api/supplychain/supplyChainId/account", {
      params: { name: "accountName" }
    })
    .reply(200, [
      {
        accountId: "accountId2",
        name: "accountName",
        path: "path/path",
        accountType: "SERVICE_ACCOUNT"
      }
    ]);

  mock
    .onGet("/api/serviceaccount/accountId2/key")
    .reply(200, { publicKey: "publicKey", keyId: "keyId" });

  const root = createComponent(editorStoreContextWithoutIds);

  await act(async () => {
    root.find('button[data-testhook-id="add-key"]').simulate("click");

    await waitFor(() => {
      root.update();
      return expect(root.find('input[name="searchinput"]').length).toBe(1);
    });

    updateField(
      root.find('input[name="searchinput"]').first(),
      "searchinput",
      "accountName"
    );

    await waitFor(() => {
      root.update();
      return expect(root.find(SearchResultEntry).length).toBe(1);
    });

    root.find(SearchResultEntry).simulate("click");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(1);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      publicKey: {
        keyId: "keyId",
        publicKey: "publicKey"
      },
      type: 31
    });
  });
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
