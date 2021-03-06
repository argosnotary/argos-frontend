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
import { mount, ReactWrapper } from "enzyme";

import MockAdapter from "axios-mock-adapter";
import Axios from "axios";
import { act } from "react-dom/test-utils";
import ManageLayoutPanel from "./ManageLayoutPanel";
import { ILayoutMetaBlock, IStep } from "../../../../interfaces/ILayout";
import TextArea from "../../../../atoms/TextArea";
import { waitFor } from "@testing-library/dom";
import { Modal } from "../../../../atoms/Modal";
import IPersonalAccountKeyPair from "../../../../interfaces/IPersonalAccountKeyPair";
import { NoCryptoWarning } from "../../../../molecules/NoCryptoWarning";
import { cryptoAvailable } from "../../../../security";
import * as layoutService from "../../LayoutService";
import { Notification } from "../../../../molecules/NotificationsList";
import {
  ArtifactCollectorType,
  IApprovalConfig
} from "../../../../interfaces/IApprovalConfig";
import HierarchyEditorTestWrapper from "../../../../test/utils";
import LayoutAuthorizedAccountEditor from "./LayoutAuthorizedAccountEditor";
import { SearchResultEntry } from "../../../../atoms/SearchInput";
import ApprovalConfigEditor from "./ApprovalConfigEditor";

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
        signature: "signature",
        keyAlgorithm: "EC",
        hashAlgorithm: "SHA384"
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
  return mount(
    <HierarchyEditorTestWrapper mockedDispatch={addItem}>
      <ManageLayoutPanel />
    </HierarchyEditorTestWrapper>
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
      authorizedKeyIds: ["authorizedKeyId1", "authorizedKeyId2"],
      expectedEndProducts: [],
      keys: [],
      layoutSegments: [
        {
          name: "jenkins",
          steps: [
            {
              name: "approve"
            } as IStep
          ]
        }
      ]
    }
  };

  mock
    .onGet("/api/supplychain/supplyChainId/layout")
    .reply(200, layoutMetaBlock);

  mock
    .onGet("/api/personalaccount", {
      params: { activeKeyIds: "authorizedKeyId1" }
    })
    .reply(200, [{ name: "account 1" }]);
  mock
    .onGet("/api/personalaccount", {
      params: { activeKeyIds: "authorizedKeyId2" }
    })
    .reply(200, []);
  mock
    .onGet("/api/personalaccount", {
      params: { inactiveKeyIds: "authorizedKeyId2" }
    })
    .reply(200, [{ name: "account 2" }]);

  const approveConfigs: Array<IApprovalConfig> = [
    {
      segmentName: "jenkins",
      stepName: "approve",
      artifactCollectorSpecifications: [
        {
          uri: "http://collecet:454/service",
          type: ArtifactCollectorType.XLDEPLOY,
          name: "collector1",
          context: { applicationName: "appName" }
        }
      ]
    }
  ];

  mock
    .onGet("/api/supplychain/supplyChainId/layout/approvalconfig")
    .reply(200, approveConfigs);

  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="jenkins-0-select-step"]').length
      ).toBe(1);
    });

    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="delete-item-1"]').length
      ).toBe(1);
    });

    expect(root.find(LayoutAuthorizedAccountEditor)).toMatchSnapshot(
      "withLayoutDetailsEditor"
    );

    root
      .find('button[data-testhook-id="jenkins-0-select-step"]')
      .simulate("click");

    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="edit-collector-0"]').length
      ).toBe(1);
    });

    expect(root.find(ManageLayoutPanel)).toMatchSnapshot();
  });
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
  (cryptoAvailable as jest.Mock).mockReturnValue(true);
  mock.onGet("/api/supplychain/supplyChainId/layout").reply(404);
  mock.onPost("/api/supplychain/supplyChainId/layout/validate").reply(400, {
    messages: [
      {
        field: "authorizedKeyIds",
        type: "DATA_INPUT",
        message: "size must be between 1 and 256"
      },
      {
        field: "expectedEndProducts",
        type: "DATA_INPUT",
        message: "size must be between 1 and 2048"
      },
      {
        field: "keys",
        type: "DATA_INPUT",
        message: "size must be between 1 and 256"
      },
      {
        field: "layoutSegments",
        type: "DATA_INPUT",
        message: "size must be between 1 and 256"
      }
    ]
  });

  const root = createComponent();

  await act(async () => {
    root.find('button[data-testhook-id="show-layout-json"]').simulate("click");

    await waitFor(() => {
      root.update();
      return expect(
        root.find('form[data-testhook-id="layout-json-form"]').length
      ).toBe(1);
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

    root
      .find('button[data-testhook-id="layout-json-form-submit-button"]')
      .simulate("click");

    await waitFor(() => {
      root.update();
      expect(root.find(Notification).length).toBe(4);
    });
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
  mock
    .onPost("/api/supplychain/supplyChainId/layout/approvalconfig")
    .reply(200);
  mock.onPost("/api/supplychain/supplyChainId/layout/releaseconfig").reply(200);
  mock.onPost("/api/supplychain/supplyChainId/layout/validate").reply(200);

  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="add-segment"]').length
      ).toBe(1);
    });

    root.find('button[data-testhook-id="show-layout-json"]').simulate("click");

    updateField(
      root.find('textarea[data-testhook-id="layout-json-form-field-0"]'),
      "layout",
      JSON.stringify({
        keys: [],
        authorizedKeyIds: [],
        expectedEndProducts: [],
        layoutSegments: []
      })
    );

    root.find('button[data-testhook-id="add-segment"]').simulate("click");

    root.find('form[data-testhook-id="segment0-name-form"]').simulate("submit");
    updateField(
      root.find('input[data-testhook-id="segment0-name-form-field-0"]'),
      "name",
      "jenkins"
    );
    root.find('form[data-testhook-id="segment0-name-form"]').simulate("submit");

    await waitFor(() => {
      root.update();
      expect(
        root
          .find('textarea[data-testhook-id="layout-json-form-field-0"]')
          .text()
      ).toContain("jenkins");
    });

    root.find('button[data-testhook-id="segment0-add-step"]').simulate("click");

    root
      .find('section[data-testhook-id="jenkins-0-edit-step"]')
      .simulate("click");

    root
      .find('form[data-testhook-id="jenkins-0-name-form"]')
      .simulate("submit");

    updateField(
      root.find('input[data-testhook-id="jenkins-0-name-form-field-0"]'),
      "name",
      "approve"
    );
    root
      .find('form[data-testhook-id="jenkins-0-name-form"]')
      .simulate("submit");
    await waitFor(() => {
      root.update();
      expect(
        root
          .find('textarea[data-testhook-id="layout-json-form-field-0"]')
          .text()
      ).toContain("approve");
    });

    root
      .find('input[data-testhook-id="make-approval-step"]')
      .simulate("change", { target: { checked: true } });
    root.find('button[data-testhook-id="add-collector"]').simulate("click");
    root.find('button[data-testhook-id="add-collector"]').simulate("click");

    await waitFor(() => {
      if (root.find('select[id="collectorType"]').length > 0) {
        root.find('select[id="collectorType"]').simulate("change", {
          target: {
            name: "collectorType",
            value: ArtifactCollectorType.XLDEPLOY
          }
        });
      }

      root.update();

      expect(root.find('select[id="collectorType"]').props().value).toBe(
        "XLDEPLOY"
      );
    });

    root
      .find('form[data-testhook-id="collector-edit-form"]')
      .simulate("submit");
    updateField(
      root.find('input[data-testhook-id="collector-edit-form-field-0"]'),
      "name",
      "xlcollect"
    );

    updateField(
      root.find('input[data-testhook-id="collector-edit-form-field-1"]'),
      "uri",
      "https://collect.org"
    );

    updateField(
      root.find('input[data-testhook-id="collector-edit-form-field-2"]'),
      "applicationName",
      "appName"
    );
    root
      .find('form[data-testhook-id="collector-edit-form"]')
      .simulate("submit");

    expect(root).toMatchSnapshot();

    await waitFor(() => {
      root.update();
      return expect(root.find("EditorForm").length).toBe(0);
    });

    root
      .find('button[data-testhook-id="layout-json-form-submit-button"]')
      .simulate("click");

    await waitFor(() => {
      root.update();
      expect(root.find(Modal).length >= 1).toBe(true);
    });

    updateField(
      root.find('input[name="passphrase"]').first(),
      "passphrase",
      "password"
    );

    root
      .find('form[data-testhook-id="passphrase-form"]')
      .first()
      .simulate("submit");

    await waitFor(() => expect(mock.history.get.length).toBe(4));
    await waitFor(() => expect(mock.history.post.length).toBe(4));

    const expectedPost = {
      layoutSegments: [
        {
          name: "jenkins",
          steps: [
            {
              authorizedKeyIds: [],
              expectedMaterials: [],
              expectedProducts: [],
              name: "approve"
            }
          ]
        }
      ]
    };

    expect(JSON.parse(mock.history.post[0].data)).toEqual(expectedPost);

    expect(mock.history.post[2].data).toEqual(
      '[{"segmentName":"jenkins","stepName":"approve","artifactCollectorSpecifications":[{"uri":"https://collect.org","name":"xlcollect","type":"XLDEPLOY","context":{"applicationName":"appName"}}]}]'
    );

    expect(mock.history.post[3].data).toEqual(
      '{"artifactCollectorSpecifications":[]}'
    );

    expect(addItem.mock.calls[0][0]).toEqual({ type: "RESET" });
    expect(mock.history.post[1].data).toBe(
      JSON.stringify(mockLayoutMetaBlock())
    );
  });
});

it("add authorized key to layout", async () => {
  mock.reset();
  (cryptoAvailable as jest.Mock).mockReturnValue(true);

  const root = createComponent();

  mock.onGet("/api/supplychain/supplyChainId/layout").reply(404);

  mock
    .onGet("/api/personalaccount", {
      params: { name: "accountName" }
    })
    .reply(200, [{ name: "accountName", id: "accountId" }]);

  mock
    .onGet("/api/personalaccount/accountId/key")
    .reply(200, { publicKey: "publicKey", keyId: "keyId" });

  mock
    .onGet("/api/personalaccount", {
      params: { activeKeyIds: "keyId" }
    })
    .reply(200, [{ name: "accountName" }]);

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="add-item"]').length
      ).toBe(1);
    });

    root.find('button[data-testhook-id="add-item"]').simulate("click");

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
      return expect(
        root.find('button[data-testhook-id="delete-item-0"]').length
      ).toBe(1);
    });

    expect(root.find(ManageLayoutPanel)).toMatchSnapshot();
  });
});
