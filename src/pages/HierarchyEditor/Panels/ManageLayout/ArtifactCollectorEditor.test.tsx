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

import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/dom";
import {
  DetailsPanelType,
  ILayoutEditorStoreContext,
  LayoutEditorStoreContext
} from "../../../../stores/LayoutEditorStore";
import { ILayout, IStep } from "../../../../interfaces/ILayout";
import theme from "../../../../theme/base.json";
import { ThemeProvider } from "styled-components";
import ArtifactCollectorEditor from "./ArtifactCollectorEditor";
import { ArtifactCollectorType } from "../../../../interfaces/IApprovalConfig";

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
    selectedLayoutElement: { step: { requiredNumberOfLinks: 12 } as IStep },
    showJson: false
  },
  dispatch: dispatch
};

function createComponent() {
  return mount(
    <ThemeProvider theme={theme}>
      <LayoutEditorStoreContext.Provider value={editorStoreContext}>
        <ArtifactCollectorEditor
          title={"Artifact Collector Editor Title"}
          artifactCollectorSpecifications={[
            {
              type: ArtifactCollectorType.XLDEPLOY,
              uri: "https://localhost:8888",
              name: "xl deploy",
              context: { applicationName: "app name" }
            }
          ]}
        />
      </LayoutEditorStoreContext.Provider>
    </ThemeProvider>
  );
}

it("renders correctly", async () => {
  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="edit-collector-0"]').length
      ).toBe(1);
    });

    expect(root.find(ArtifactCollectorEditor)).toMatchSnapshot();
  });
});

it("delete collector", async () => {
  dispatch.mockReset();
  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="delete-collector-0"]').length
      ).toBe(1);
    });

    root
      .find('button[data-testhook-id="delete-collector-0"]')
      .simulate("click");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(1);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      artifactCollector: {
        context: {
          applicationName: "app name"
        },
        name: "xl deploy",
        type: "XLDEPLOY",
        uri: "https://localhost:8888"
      },
      type: 17
    });
  });
});

it("edit collector", async () => {
  dispatch.mockReset();
  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="edit-collector-0"]').length
      ).toBe(1);
    });

    root.find('button[data-testhook-id="edit-collector-0"]').simulate("click");

    await waitFor(() => {
      root.update();
      return expect(
        root.find('input[data-testhook-id="collector-edit-form-field-0"]')
          .length
      ).toBe(1);
    });

    expect(root.find(ArtifactCollectorEditor)).toMatchSnapshot();

    updateField(
      root.find('input[data-testhook-id="collector-edit-form-field-0"]'),
      "name",
      "changedname"
    );

    root
      .find('form[data-testhook-id="collector-edit-form"]')
      .simulate("submit");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(1);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      artifactCollector: {
        context: {
          applicationName: "app name"
        },
        name: "changedname",
        type: "XLDEPLOY",
        uri: "https://localhost:8888"
      },
      type: 15
    });
  });
});

it("add collector", async () => {
  dispatch.mockReset();
  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="edit-collector-0"]').length
      ).toBe(1);
    });

    root.find('button[data-testhook-id="add-collector"]').simulate("click");

    await waitFor(() => {
      if (root.find('select[id="collectorType"]').length > 0) {
        root.find('select[id="collectorType"]').simulate("change", {
          target: {
            name: "collectorType",
            value: ArtifactCollectorType.GIT
          }
        });
      }
      root.update();

      expect(root.find('select[id="collectorType"]').props().value).toBe("GIT");
    });

    root
      .find('form[data-testhook-id="collector-edit-form"]')
      .simulate("submit");

    updateField(
      root.find('input[data-testhook-id="collector-edit-form-field-0"]'),
      "name",
      "gitname"
    );
    updateField(
      root.find('input[data-testhook-id="collector-edit-form-field-1"]'),
      "uri",
      "http://new.nl"
    );
    updateField(
      root.find('input[data-testhook-id="collector-edit-form-field-2"]'),
      "repository",
      "repro"
    );

    root
      .find('form[data-testhook-id="collector-edit-form"]')
      .simulate("submit");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(1);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      artifactCollector: {
        context: {
          repository: "repro"
        },
        name: "gitname",
        type: "GIT",
        uri: "http://new.nl"
      },
      type: 16
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
