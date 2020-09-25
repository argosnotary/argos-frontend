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

import MockAdapter from "axios-mock-adapter";
import Axios from "axios";
import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/dom";
import HierarchyEditorTestWrapper from "../../../../test/utils";
import ReleaseExecutionDetailsPanel from "./ReleaseExecutionDetailsPanel";
import CollapsibleContainerComponent from "../../../../atoms/CollapsibleContainer";
import { LoaderButton } from "../../../../atoms/Button";
import { Warning } from "../../../../atoms/Alerts";

const mock = new MockAdapter(Axios);

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  })
}));

function createComponent() {
  return mount(
    <HierarchyEditorTestWrapper
      mockedDispatch={() => {
        return;
      }}>
      <ReleaseExecutionDetailsPanel />
    </HierarchyEditorTestWrapper>
  );
}

const updateField = (wrapper: ReactWrapper<any>, name: string, value: any) => {
  wrapper.simulate("change", {
    persist: () => {},
    target: {
      name,
      value
    }
  });
};

let root: any;

describe("ReleaseExecutionDetailsPanel", () => {
  it("displays the right number of approval configs", async () => {
    const localRoot = createComponent();
    mock
      .onGet("/api/supplychain/supplyChainId/layout/releaseconfig")
      .reply(200, {
        artifactCollectorSpecifications: [
          {
            name: "repo",
            type: "GIT",
            uri: "http://localhost:8888",
            context: { repository: "aaa" }
          },
          {
            name: "anoter",
            type: "XLDEPLOY",
            uri: "http://localhost:8888",
            context: { applicationName: "jjjhhj" }
          },
          {
            name: "as",
            type: "XLDEPLOY",
            uri: "http://localhost:8888",
            context: { applicationName: "aa" }
          }
        ]
      });

    await act(async () => {
      await waitFor(() => {
        localRoot.update();
        return expect(
          localRoot.find(CollapsibleContainerComponent).length
        ).toBe(3);
      });
    });
  });

  it("calls collector api for each config", async () => {
    root = createComponent();

    mock
      .onGet("/api/supplychain/supplyChainId/layout/releaseconfig")
      .reply(200, {
        artifactCollectorSpecifications: [
          {
            name: "anoter",
            type: "XLDEPLOY",
            uri: "http://localhost:8888",
            context: { applicationName: "jjjhhj" }
          },
          {
            name: "as",
            type: "XLDEPLOY",
            uri: "http://localhost:8888",
            context: { applicationName: "aa" }
          }
        ]
      });

    mock.onPost("http://localhost:8888/api/collector/artifacts").reply(200, [
      {
        uri: "deployit-manifest.xml",
        hash: "995e418909d8402e93885fa30d212eca41754f51165486266978aedce0337c48"
      }
    ]);

    mock
      .onPost("/api/supplychain/supplyChainId/release")
      .reply(200, { releaseIsValid: false });

    await act(async () => {
      await waitFor(() => {
        root.update();
        return expect(root.find(CollapsibleContainerComponent).length).toBe(2);
      });

      updateField(
        root.find(
          'input[data-testhook-id="xl-deploy-collector-execution-form-0-field-0"]'
        ),
        "username",
        "user1"
      );

      updateField(
        root.find(
          'input[data-testhook-id="xl-deploy-collector-execution-form-0-field-1"]'
        ),
        "password",
        "pass1"
      );

      updateField(
        root.find(
          'input[data-testhook-id="xl-deploy-collector-execution-form-0-field-2"]'
        ),
        "applicationVersion",
        "appversion1"
      );

      root
        .find(
          'button[data-testhook-id="xl-deploy-collector-execution-form-0-submit-button"]'
        )
        .simulate("mouseDown");

      await waitFor(() => {
        root.update();
        return expect(
          root.find(
            'input[data-testhook-id="xl-deploy-collector-execution-form-1-field-0"]'
          ).length
        ).toBe(1);
      });

      updateField(
        root.find(
          'input[data-testhook-id="xl-deploy-collector-execution-form-1-field-0"]'
        ),
        "username",
        "user1"
      );

      updateField(
        root.find(
          'input[data-testhook-id="xl-deploy-collector-execution-form-1-field-1"]'
        ),
        "password",
        "pass1"
      );

      updateField(
        root.find(
          'input[data-testhook-id="xl-deploy-collector-execution-form-1-field-2"]'
        ),
        "applicationVersion",
        "appversion1"
      );

      root
        .find(
          'button[data-testhook-id="xl-deploy-collector-execution-form-1-submit-button"]'
        )
        .simulate("mouseDown");

      await waitFor(() => {
        root.update();
        return expect(root.find(LoaderButton).prop("disabled")).toEqual(false);
      });

      root.find(LoaderButton).simulate("click");
    });
  });

  it("generates correct release call", async () => {
    await waitFor(() => expect(mock.history.post.length).toBe(3));

    expect(mock.history.post[2].data).toBe(
      '{"releaseArtifacts":[[{"uri":"deployit-manifest.xml","hash":"995e418909d8402e93885fa30d212eca41754f51165486266978aedce0337c48"}],[{"uri":"deployit-manifest.xml","hash":"995e418909d8402e93885fa30d212eca41754f51165486266978aedce0337c48"}]]}'
    );
  });

  it("show invalid release error, on invalid release response", async () => {
    root.update();
    await waitFor(() => expect(root.find(Warning).length).toBe(1));
  });
});
