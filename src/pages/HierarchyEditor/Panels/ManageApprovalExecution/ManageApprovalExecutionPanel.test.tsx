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
import { FormPermissions } from "../../../../types/FormPermission";
import { waitFor } from "@testing-library/dom";
import IPersonalAccountKeyPair from "../../../../interfaces/IPersonalAccountKeyPair";
import { cryptoAvailable } from "../../../../security";
import * as linkSigningService from "../../LinkSigningService";
import { HierarchyEditorPaneActionTypes } from "../../../../stores/hierarchyEditorStore";
import { StateContext } from "../../HierarchyEditor";
import {
  ArtifactCollectorType,
  IApprovalConfig
} from "../../../../interfaces/IApprovalConfig";
import ManageApprovalExecutionPanel from "./ManageApprovalExecutionPanel";
import { SelectListItem } from "../../../../atoms/SelectList";
import { IArtifact, ILinkMetaBlock } from "../../../../interfaces/ILink";

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

function mockLinkMetaBlock(): ILinkMetaBlock {
  return {
    signature: {
      keyId: "keyId",
      signature: "signature"
    },
    supplyChainId: "supplyChainId",
    link: {
      products: [{ hash: "product1", uri: "productUri1" }],
      materials: [{ hash: "mat1", uri: "mapUri1" }],
      command: [],
      runId: "runId",
      stepName: "stepName",
      layoutSegmentName: "layoutSegmentName"
    }
  };
}

jest
  .spyOn(linkSigningService, "signLink")
  .mockResolvedValue(mockLinkMetaBlock());

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
        <ManageApprovalExecutionPanel />
      </StateContext.Provider>
    </ThemeProvider>
  );
}

const approvels: Array<IApprovalConfig> = [
  {
    segmentName: "segment1",
    stepName: "step1",
    artifactCollectorSpecifications: [
      {
        name: "collector1",
        uri: "/collector1",
        type: ArtifactCollectorType.XLDEPLOY,
        context: {
          applicationName: "applicationName1"
        }
      },
      {
        name: "collector2",
        uri: "/collector2",
        type: ArtifactCollectorType.XLDEPLOY,
        context: {
          applicationName: "applicationName2"
        }
      }
    ]
  },
  {
    segmentName: "segment2",
    stepName: "step1",
    artifactCollectorSpecifications: [
      {
        name: "collector3",
        uri: "/collector3",
        type: ArtifactCollectorType.XLDEPLOY,
        context: {
          applicationName: "applicationName3"
        }
      },
      {
        name: "collector4",
        uri: "/collector4",
        type: ArtifactCollectorType.XLDEPLOY,
        context: {
          applicationName: "applicationName4"
        }
      }
    ]
  }
];

it("renders correctly with no existing approvals", async () => {
  mock.reset();
  mock
    .onGet("/api/supplychain/supplyChainId/layout/approvalconfig/me")
    .reply(200, []);
  (cryptoAvailable as jest.Mock).mockReturnValue(true);
  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('p[data-testhook-id="no-approvals"]').length
      ).toBe(1);
    });
    expect(root.find(ManageApprovalExecutionPanel)).toMatchSnapshot();
  });
});

it("renders correctly with existing approvals", async () => {
  mock.reset();

  mock
    .onGet("/api/supplychain/supplyChainId/layout/approvalconfig/me")
    .reply(200, approvels);
  (cryptoAvailable as jest.Mock).mockReturnValue(true);
  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(root.find(SelectListItem).length).toBe(2);
    });
    expect(root.find(ManageApprovalExecutionPanel)).toMatchSnapshot();
  });
});

it("approval happy flow", async () => {
  mock.reset();

  mock
    .onGet("/api/supplychain/supplyChainId/layout/approvalconfig/me")
    .reply(200, approvels);

  mock
    .onPost("/collector1/api/collector/artifacts")
    .reply(200, [{ uri: "uri1", hash: "hash1" }] as Array<IArtifact>);
  mock
    .onPost("/collector2/api/collector/artifacts")
    .reply(200, [{ uri: "uri2", hash: "hash2" }] as Array<IArtifact>);

  const key: IPersonalAccountKeyPair = {
    encryptedPrivateKey: "encryptedPrivateKey",
    keyId: "keyId",
    publicKey: "publicKey"
  };

  mock.onGet("/api/personalaccount/me/key").reply(200, key);

  mock.onPost("/api/supplychain/supplyChainId/link").reply(204);

  (cryptoAvailable as jest.Mock).mockReturnValue(true);
  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(root.find(SelectListItem).length).toBe(2);
    });

    root
      .find('label[data-testhook-id="select-list-item-segment1-step1"]')
      .simulate("click");
    await waitFor(() => {
      root.update();
      return expect(
        root.find(
          'input[data-testhook-id="collector-execution-form-0-field-0"]'
        ).length
      ).toBe(1);
    });

    expect(root.find(ManageApprovalExecutionPanel)).toMatchSnapshot();

    updateField(
      root.find('input[data-testhook-id="collector-execution-form-0-field-0"]'),
      "username",
      "user1"
    );

    updateField(
      root.find('input[data-testhook-id="collector-execution-form-0-field-1"]'),
      "password",
      "pass1"
    );

    updateField(
      root.find('input[data-testhook-id="collector-execution-form-0-field-2"]'),
      "applicationVersion",
      "appversion1"
    );
    root.update();
    root
      .find('form[data-testhook-id="collector-execution-form-0"]')
      .simulate("blur");
    root
      .find(
        'button[data-testhook-id="collector-execution-form-0-submit-button"]'
      )
      .simulate("submit");

    await waitFor(() => {
      root.update();
      return expect(
        root.find(
          'input[data-testhook-id="collector-execution-form-1-field-0"]'
        ).length
      ).toBe(1);
    });

    updateField(
      root.find('input[data-testhook-id="collector-execution-form-1-field-0"]'),
      "username",
      "user2"
    );

    updateField(
      root.find('input[data-testhook-id="collector-execution-form-1-field-1"]'),
      "password",
      "pass2"
    );

    updateField(
      root.find('input[data-testhook-id="collector-execution-form-1-field-2"]'),
      "applicationVersion",
      "appversion2"
    );
    root.update();
    root
      .find('form[data-testhook-id="collector-execution-form-1"]')
      .simulate("blur");
    root
      .find(
        'button[data-testhook-id="collector-execution-form-1-submit-button"]'
      )
      .simulate("submit");

    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="approve-button"]').props().disabled
      ).toBe(false);
    });

    root.find('button[data-testhook-id="approve-button"]').simulate("click");

    await waitFor(() => {
      root.update();
      return expect(
        root.find('input[data-testhook-id="passphrase-form-field-0"]').length
      ).toBe(1);
    });

    root
      .find('button[data-testhook-id="passphrase-form-submit-button"]')
      .simulate("submit");
    updateField(
      root.find('input[data-testhook-id="passphrase-form-field-0"]'),
      "passphrase",
      "passphrase"
    );

    root
      .find('button[data-testhook-id="passphrase-form-submit-button"]')
      .simulate("submit");

    await waitFor(() => expect(mock.history.post.length).toBe(3));

    expect(mock.history.post[0].data).toBe(
      '{"applicationName":"applicationName1","version":"appversion1","username":"user1","password":"pass1"}'
    );

    expect(mock.history.post[1].data).toBe(
      '{"applicationName":"applicationName2","version":"appversion2","username":"user2","password":"pass2"}'
    );

    expect(mock.history.post[2].data).toBe(JSON.stringify(mockLinkMetaBlock()));
    expect(addItem.mock.calls[0][0]).toEqual({ type: "RESET_PANE" });
  });
});

const updateField = (wrapper: ReactWrapper<any>, name: string, value: any) => {
  wrapper.simulate("change", {
    persist: () => {},
    target: {
      name,
      value
    }
  });
  wrapper.simulate("blur");
};
