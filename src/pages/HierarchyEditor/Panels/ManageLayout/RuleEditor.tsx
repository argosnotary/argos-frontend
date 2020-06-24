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

import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import {
  ActionIconsContainer,
  BaseActionButton,
  CollectionContainer,
  CollectionContainerButton,
  CollectionContainerList,
  CollectionContainerRow,
  CollectionContainerSpan,
  CollectionContainerTitle
} from "../../../../atoms/Collection";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import { PlusIcon } from "../../../../atoms/Icons";
import { IRule, RuleDestinationTypeEnum } from "../../../../interfaces/ILayout";
import EditIcon from "../../../../atoms/Icons/EditIcon";
import useFormBuilder, {
  FormSubmitButtonHandlerTypes,
  IFormBuilderConfig
} from "../../../../hooks/useFormBuilder";
import { FormPermissions } from "../../../../types/FormPermission";
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";

const ItemContainer = styled(CollectionContainer)`
  min-height: 0;
  flex-direction: column;
  border: 0;
  padding: 0 1rem 1rem;
  border: 1px solid
    ${props => props.theme.layoutBuilder.segmentContainerBorderColor};
`;

const ItemContainerTitle = styled(CollectionContainerTitle)`
  font-size: 0.85rem;
  top: -1rem;
  color: ${props => props.theme.layoutBuilder.segmentsContainerTitleColor};
  background-color: ${props =>
    props.theme.layoutBuilder.segmentContainerTitleBgColor};
  padding: 0.25rem 2rem 0.4rem;
`;

const AddItemButton = styled(CollectionContainerButton)`
  right: 0;

  &:hover {
    cursor: pointer;
    transform: scale(0.8);
  }
`;

const ItemTitle = styled.header`
  border: 1px solid transparent;
  box-sizing: border-box;
  padding: 0.5rem;
  width: 100%;
  margin: 0.2rem 0 0;
  background-color: ${props => props.theme.layoutBuilder.segmentTitleBgColor};

  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    margin: 0 0.5rem;
  }
`;

const ItemContainerSection = styled.section`
  width: 100%;
  margin: 0 0 1rem;
`;

const RemoveItemButton = styled(BaseActionButton)``;
const EditItemButton = styled(BaseActionButton)``;

interface IRuleFormValues {
  pattern: string;
  sourcePathPrefix?: string;
  destinationPathPrefix?: string;
  destinationSegmentName?: string;
  destinationType?: string;
  destinationStepName?: string;
}

const validateApprovalExecutionForm = (_values: IRuleFormValues) => {
  const errors = {} as IRuleFormValues;

  return errors;
};

const getApprovalExecutionFormSchema = (): IGenericFormSchema => {
  return [
    {
      labelValue: "Pattern*",
      name: "pattern",
      formType: "text"
    },
    {
      labelValue: "Source Path Prefix",
      name: "sourcePathPrefix",
      formType: "text"
    },
    {
      labelValue: "Destination Path Prefix",
      name: "destinationPathPrefix",
      formType: "text"
    },
    {
      labelValue: "Destination Type*",
      name: "destinationType",
      formType: "text"
    },
    {
      labelValue: "Destination Segment Name*",
      name: "destinationSegmentName",
      formType: "text"
    },
    {
      labelValue: "Destination Step Name*",
      name: "destinationStepName",
      formType: "text"
    }
  ];
};

const RuleEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const [rules, setRules] = useState<Array<IRule>>([]);

  const [ruleToEdit, setRuleToEdit] = useState<IRule | undefined>(undefined);

  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    if (
      editorStoreContext.state.layout.expectedEndProducts &&
      editorStoreContext.state.layout.expectedEndProducts.length > 0
    ) {
      setRules(editorStoreContext.state.layout.expectedEndProducts);
    } else {
      setRules([]);
    }
    setRuleToEdit(undefined);
  }, [editorStoreContext.state.layout.expectedEndProducts]);

  const deleteRule = (index: number) => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.REMOVE_EXPECTED_END_PRODUCT,
      rule: rules[index]
    });
  };

  const addRule = () => {
    const ruleToAdd = {} as IRule;
    setAddMode(true);
    setRules([...rules, ruleToAdd]);
    setRuleToEdit(ruleToAdd);
  };

  const editRule = (index: number) => {
    setAddMode(false);
    setRuleToEdit(rules[index]);
  };

  const updateRule = (ruleForm: IRuleFormValues) => {
    if (ruleToEdit) {
      ruleToEdit.destinationPathPrefix = ruleForm.destinationPathPrefix;
      ruleToEdit.destinationType = ruleForm.destinationType as RuleDestinationTypeEnum;
      ruleToEdit.destinationStepName = ruleForm.destinationSegmentName;
      ruleToEdit.sourcePathPrefix = ruleForm.sourcePathPrefix;
      ruleToEdit.pattern = ruleForm.pattern;
      ruleToEdit.destinationSegmentName = ruleForm.destinationSegmentName;

      if (addMode) {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.ADD_EXPECTED_END_PRODUCT,
          rule: ruleToEdit
        });
      } else {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.EDIT_EXPECTED_END_PRODUCT,
          rule: ruleToEdit
        });
      }
    }
  };

  const formConfig: IFormBuilderConfig = {
    dataTesthookId: "rule-edit-form",
    schema: getApprovalExecutionFormSchema(),
    permission: FormPermissions.EDIT,
    isLoading: false,
    validate: values => validateApprovalExecutionForm(values),
    onSubmit: form => {
      updateRule(form as IRuleFormValues);
    },
    onCancel: () => {
      if (addMode) {
        rules.splice(rules.length - 1, 1);
        setRules([...rules]);
      }
      setRuleToEdit(undefined);
    },
    confirmationLabel: "Save",
    cancellationLabel: "Cancel",
    autoFocus: true,
    buttonHandler: FormSubmitButtonHandlerTypes.MOUSEDOWN
  };

  const [formJSX, formAPI] = useFormBuilder(formConfig);

  useEffect(() => {
    if (ruleToEdit) {
      formAPI.setInitialFormValues({
        pattern: ruleToEdit.pattern,
        sourcePathPrefix: ruleToEdit.sourcePathPrefix || "",
        destinationPathPrefix: ruleToEdit.destinationPathPrefix || "",
        destinationSegmentName: ruleToEdit.destinationSegmentName || "",
        destinationType: ruleToEdit.destinationType || "",
        destinationStepName: ruleToEdit.destinationStepName || ""
      });
    }
  }, [ruleToEdit]);

  const getRuleInfo = (rule: IRule): string => {
    return `${rule.ruleType ? rule.ruleType.toLowerCase() + " - " : ""}${
      rule.pattern
    } - ${rule.destinationPathPrefix}`;
  };

  const ruleRow = (rule: IRule, index: number) => {
    return (
      <ItemContainerSection>
        <ItemTitle>
          <CollectionContainerSpan>{getRuleInfo(rule)}</CollectionContainerSpan>
          <ActionIconsContainer>
            <EditItemButton
              ata-testhook-id={"edit-rule-" + index}
              onClick={() => editRule(index)}>
              <EditIcon size={26} color={theme.layoutBuilder.iconColor} />
            </EditItemButton>
            <RemoveItemButton
              data-testhook-id={"delete-rule-" + index}
              onClick={() => deleteRule(index)}>
              <RemoveIcon size={24} color={theme.layoutBuilder.iconColor} />
            </RemoveItemButton>
          </ActionIconsContainer>
        </ItemTitle>
      </ItemContainerSection>
    );
  };

  return (
    <>
      <ItemContainer>
        <CollectionContainerRow>
          <ItemContainerTitle>Expected End Products</ItemContainerTitle>
          <AddItemButton data-testhook-id={"add-rule"} onClick={addRule}>
            <PlusIcon size={24} color={theme.layoutBuilder.iconColor} />
          </AddItemButton>
        </CollectionContainerRow>
        <CollectionContainerList>
          {rules.map((rule, index) => {
            return (
              <>
                {ruleToEdit === rule ? (
                  <>{formJSX}</>
                ) : (
                  <li key={"rule-row-" + index}>{ruleRow(rule, index)}</li>
                )}
              </>
            );
          })}
        </CollectionContainerList>
      </ItemContainer>
    </>
  );
};

export default RuleEditor;
