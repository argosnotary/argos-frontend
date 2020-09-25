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
import {
  DetailsPanelType,
  ILayoutEditorStoreContext,
  LayoutEditorStoreContext
} from "../../../../stores/LayoutEditorStore";
import { ILayout, IStep } from "../../../../interfaces/ILayout";
import theme from "../../../../theme/base.json";
import { ThemeProvider } from "styled-components";
import RequiredNumberOfLinks from "./RequiredNumberOfLinks";

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
        <RequiredNumberOfLinks />
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
        root.find(
          'input[data-testhook-id="required-number-of-links-form-field-0"]'
        ).length
      ).toBe(1);
    });

    expect(root.find(RequiredNumberOfLinks)).toMatchSnapshot();
  });
});

it("update required number of links", async () => {
  const root = createComponent();

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find(
          'input[data-testhook-id="required-number-of-links-form-field-0"]'
        ).length
      ).toBe(1);
    });

    root
      .find('form[data-testhook-id="required-number-of-links-form"]')
      .simulate("submit");

    expect(root.find(RequiredNumberOfLinks)).toMatchSnapshot();

    updateField(
      root.find(
        'input[data-testhook-id="required-number-of-links-form-field-0"]'
      ),
      "requiredNumberOfLinks",
      "4"
    );

    root
      .find('form[data-testhook-id="required-number-of-links-form"]')
      .simulate("submit");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(2);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      layoutStep: {
        requiredNumberOfLinks: 4
      },
      type: 30
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
