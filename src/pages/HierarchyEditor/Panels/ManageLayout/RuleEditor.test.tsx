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
  LayoutEditorActionType,
  LayoutEditorStoreContext
} from "../../../../stores/LayoutEditorStore";
import {
  ILayout,
  IRule,
  IStep,
  RuleDestinationTypeEnum,
  RuleRuleTypeEnum
} from "../../../../interfaces/ILayout";
import theme from "../../../../theme/base.json";
import { ThemeProvider } from "styled-components";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn()
  })
}));

const dispatch = jest.fn();

const editorStoreContextExpectedEndProduct: ILayoutEditorStoreContext = {
  state: {
    layout: {
      expectedEndProducts: [
        {
          pattern: "pattern",
          destinationSegmentName: "seg1",
          sourcePathPrefix: "sourcePathPrefix",
          destinationStepName: "step1",
          destinationType: RuleDestinationTypeEnum.MATERIALS,
          destinationPathPrefix: "destinationPathPrefix",
          ruleType: RuleRuleTypeEnum.MATCH
        }
      ],
      layoutSegments: [
        {
          name: "seg1",
          steps: [
            {
              name: "step1"
            },
            {
              name: "step2"
            }
          ]
        },
        {
          name: "seg2",
          steps: [
            {
              name: "stepa"
            },
            {
              name: "stepb"
            }
          ]
        }
      ]
    } as ILayout,
    detailPanelMode: DetailsPanelType.LAYOUT_DETAILS,
    approvalConfigs: [],
    showSigningDialog: false,
    loading: false,
    activeEditLayoutElement: undefined,
    selectedLayoutElement: undefined
  },
  dispatch: dispatch
};

const editorStoreContextStepRule: ILayoutEditorStoreContext = {
  state: {
    layout: {
      layoutSegments: [
        {
          name: "seg1",
          steps: [
            {
              name: "step1"
            },
            {
              name: "step2"
            }
          ]
        },
        {
          name: "seg2",
          steps: [
            {
              name: "step3"
            },
            {
              name: "step4"
            }
          ]
        }
      ]
    } as ILayout,
    detailPanelMode: DetailsPanelType.LAYOUT_DETAILS,
    approvalConfigs: [],
    showSigningDialog: false,
    loading: false,
    activeEditLayoutElement: undefined,
    selectedLayoutElement: {
      segment: {
        name: "seg1",
        steps: [
          {
            name: "step1"
          },
          {
            name: "step2"
          } as IStep
        ]
      },
      step: {
        name: "step1",
        expectedMaterials: [
          {
            ruleType: RuleRuleTypeEnum.CREATE,
            pattern: "pattern1"
          }
        ]
      } as IStep
    }
  },
  dispatch: dispatch
} as ILayoutEditorStoreContext;

function createComponent(
  editorStoreContext: ILayoutEditorStoreContext,
  initialRules?: Array<IRule>
) {
  return mount(
    <ThemeProvider theme={theme}>
      <LayoutEditorStoreContext.Provider value={editorStoreContext}>
        <RuleEditor
          title={"Expected End Products"}
          initialRules={initialRules}
          addAction={LayoutEditorActionType.ADD_EXPECTED_END_PRODUCT}
          editAction={LayoutEditorActionType.EDIT_EXPECTED_END_PRODUCT}
          removeAction={LayoutEditorActionType.REMOVE_EXPECTED_END_PRODUCT}
        />
      </LayoutEditorStoreContext.Provider>
    </ThemeProvider>
  );
}

it("renders correctly", async () => {
  const root = createComponent(
    editorStoreContextExpectedEndProduct,
    editorStoreContextExpectedEndProduct.state.layout.expectedEndProducts
  );

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="edit-rule-0"]').length
      ).toBe(1);
    });

    expect(root.find(RuleEditor)).toMatchSnapshot();
  });
});

it("add rule expected end product", async () => {
  dispatch.mockReset();
  const root = createComponent(
    editorStoreContextExpectedEndProduct,
    editorStoreContextExpectedEndProduct.state.layout.expectedEndProducts
  );

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="edit-rule-0"]').length
      ).toBe(1);
    });

    root.find('button[data-testhook-id="add-rule"]').simulate("click");

    root.find('form[data-testhook-id="rule-edit-form"]').simulate("submit");

    expect(root.find(RuleEditor)).toMatchSnapshot();

    updateField(
      root.find('input[data-testhook-id="rule-edit-form-field-0"]'),
      "pattern",
      "pattern1"
    );

    updateField(
      root.find('input[data-testhook-id="rule-edit-form-field-1"]'),
      "sourcePathPrefix",
      "sourcePathPrefix1"
    );

    updateField(
      root.find('input[data-testhook-id="rule-edit-form-field-2"]'),
      "destinationPathPrefix",
      "destinationPathPrefix1"
    );

    updateField(
      root.find('select[data-testhook-id="rule-edit-form-field-3"]'),
      "destinationType",
      "PRODUCTS"
    );

    updateField(
      root.find('select[data-testhook-id="rule-edit-form-field-4"]'),
      "destinationSegmentName",
      "seg2"
    );

    updateField(
      root.find('select[data-testhook-id="rule-edit-form-field-5"]'),
      "destinationStepName",
      "step4"
    );

    root.find('form[data-testhook-id="rule-edit-form"]').simulate("submit");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(1);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      rule: {
        destinationPathPrefix: "destinationPathPrefix1",
        destinationSegmentName: "seg2",
        destinationStepName: "step4",
        destinationType: "PRODUCTS",
        pattern: "pattern1",
        sourcePathPrefix: "sourcePathPrefix1"
      },
      type: 21
    });
  });
});

it("add rule allow", async () => {
  dispatch.mockReset();
  const root = createComponent(
    editorStoreContextStepRule,
    editorStoreContextStepRule.state.selectedLayoutElement?.step
      ?.expectedMaterials
  );

  await act(async () => {
    await waitFor(() => {
      root.update();
      return expect(
        root.find('button[data-testhook-id="edit-rule-0"]').length
      ).toBe(1);
    });

    root.find('button[data-testhook-id="add-rule"]').simulate("click");

    await waitFor(() => {
      root.find('select[id="ruleType"]').simulate("change", {
        target: {
          name: "ruleType",
          value: "ALLOW"
        }
      });
      root.update();

      expect(root.find('select[id="ruleType"]').props().value).toBe("ALLOW");
    });

    root.find('form[data-testhook-id="rule-edit-form"]').simulate("submit");

    expect(root.find(RuleEditor)).toMatchSnapshot();

    updateField(
      root.find('input[data-testhook-id="rule-edit-form-field-0"]'),
      "pattern",
      "pattern2"
    );

    root.find('form[data-testhook-id="rule-edit-form"]').simulate("submit");

    await waitFor(() => {
      root.update();
      return expect(dispatch.mock.calls.length).toBe(1);
    });

    expect(dispatch.mock.calls[0][0]).toEqual({
      rule: {
        pattern: "pattern2",
        ruleType: "ALLOW"
      },
      type: 21
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
