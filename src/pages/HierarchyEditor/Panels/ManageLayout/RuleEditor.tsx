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
  CollectionContainerTitle,
  CollectionContainerCard
} from "../../../../atoms/Collection";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import {
  ILayoutEditorStoreContext,
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import { PlusIcon } from "../../../../atoms/Icons";
import {
  IRule,
  RuleDestinationTypeEnum,
  RuleRuleTypeEnum
} from "../../../../interfaces/ILayout";
import EditIcon from "../../../../atoms/Icons/EditIcon";
import useFormBuilder, {
  FormSubmitButtonHandlerTypes,
  IFormBuilderConfig,
  FormContainer
} from "../../../../hooks/useFormBuilder";
import { FormPermissions } from "../../../../types/FormPermission";
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import {
  getSegmentNames,
  getStepNamesForSegment
} from "../../../../stores/LayoutEditorService";
import Select, { SelectionContainer } from "../../../../atoms/Select";

const ItemContainer = styled(CollectionContainer)`
  li ~ ${FormContainer} {
    margin-top: 1rem;
  }

  li ~ section ~ ${FormContainer} {
    margin-top: 0;
  }
`;

const ItemContainerTitle = styled(CollectionContainerTitle)``;

const AddItemButton = styled(CollectionContainerButton)``;

const ItemTitle = styled(CollectionContainerCard)``;

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

export interface IRuleEditorProps {
  title: string;
  initialRules?: IRule[];
  addAction: LayoutEditorActionType;
  editAction: LayoutEditorActionType;
  removeAction: LayoutEditorActionType;
}

const getSelectSegment = (context: ILayoutEditorStoreContext) => {
  return context.state.selectedLayoutElement
    ? context.state.selectedLayoutElement.segment
    : undefined;
};

const getStepsFromSelectedSegment = (context: ILayoutEditorStoreContext) => {
  const selectSegment = getSelectSegment(context);
  return selectSegment ? selectSegment.steps.map(segment => segment.name) : [];
};

const expectedProduct = "expectedProduct";

const RuleEditor: React.FC<IRuleEditorProps> = ({
  title,
  initialRules,
  addAction,
  editAction,
  removeAction
}) => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const [rules, setRules] = useState<Array<IRule>>([]);

  const [ruleToEdit, setRuleToEdit] = useState<IRule | undefined>(undefined);

  const [addMode, setAddMode] = useState(false);

  const [steps, setSteps] = useState<Array<string>>(
    getStepsFromSelectedSegment(editorStoreContext)
  );

  const [selectedSegment, setSelectedSegment] = useState<string | undefined>(
    undefined
  );

  const [ruleType, setRuleType] = useState<
    RuleRuleTypeEnum | "select" | "expectedProduct"
  >(getSelectSegment(editorStoreContext) ? "select" : expectedProduct);

  useEffect(() => {
    setSteps(getStepsFromSelectedSegment(editorStoreContext));
    if (getSelectSegment(editorStoreContext)) {
      setRuleType("select");
    }
  }, [editorStoreContext.state.selectedLayoutElement]);

  useEffect(() => {
    if (ruleToEdit) {
      setSelectedSegment(ruleToEdit.destinationSegmentName);
      setRuleType(
        getSelectSegment(editorStoreContext)
          ? ruleToEdit.ruleType
            ? ruleToEdit.ruleType
            : "select"
          : expectedProduct
      );
    } else {
      setSelectedSegment(undefined);
      setRuleType(
        getSelectSegment(editorStoreContext) ? "select" : expectedProduct
      );
    }
  }, [ruleToEdit]);

  useEffect(() => {
    if (selectedSegment) {
      setSteps(
        getStepNamesForSegment(editorStoreContext.state.layout, selectedSegment)
      );
    } else {
      setSteps(getStepsFromSelectedSegment(editorStoreContext));
    }
  }, [selectedSegment]);

  useEffect(() => {
    if (initialRules && initialRules.length > 0) {
      setRules(initialRules);
    } else {
      setRules([]);
    }
    setRuleToEdit(undefined);
  }, [initialRules]);

  const deleteRule = (index: number) => {
    editorStoreContext.dispatch({
      type: removeAction,
      rule: rules[index]
    });
  };

  const addRule = () => {
    if (ruleToEdit === undefined) {
      const ruleToAdd = {} as IRule;
      setAddMode(true);
      setRules([...rules, ruleToAdd]);
      setRuleToEdit(ruleToAdd);
    }
  };

  const editRule = (index: number) => {
    setAddMode(false);
    setRuleToEdit(rules[index]);
  };

  const updateRule = (formValues: IRuleFormValues) => {
    if (ruleToEdit) {
      ruleToEdit.pattern = formValues.pattern;

      if (ruleType === expectedProduct || ruleType === RuleRuleTypeEnum.MATCH) {
        ruleToEdit.destinationPathPrefix = formValues.destinationPathPrefix;
        ruleToEdit.destinationType = formValues.destinationType as RuleDestinationTypeEnum;
        ruleToEdit.destinationStepName = formValues.destinationStepName;
        ruleToEdit.sourcePathPrefix = formValues.sourcePathPrefix;
        ruleToEdit.destinationSegmentName = formValues.destinationSegmentName;
      }

      if (ruleType !== expectedProduct) {
        ruleToEdit.ruleType = ruleType as RuleRuleTypeEnum;
      }

      if (addMode) {
        editorStoreContext.dispatch({
          type: addAction,
          rule: ruleToEdit
        });
      } else {
        editorStoreContext.dispatch({
          type: editAction,
          rule: ruleToEdit
        });
      }
    }
  };

  const getApprovalExecutionFormSchema = (): IGenericFormSchema => {
    if (ruleType === expectedProduct || ruleType === RuleRuleTypeEnum.MATCH) {
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
          formType: "select",
          options: [
            { name: "products", value: RuleDestinationTypeEnum.PRODUCTS },
            { name: "materials", value: RuleDestinationTypeEnum.MATERIALS }
          ]
        },
        {
          labelValue: `Destination Segment Name${
            ruleType === RuleRuleTypeEnum.MATCH ? "" : "*"
          }`,
          name: "destinationSegmentName",
          formType: "select",
          options: getSegmentNames(
            editorStoreContext.state.layout
          ).map(segmentName => ({ name: segmentName, value: segmentName }))
        },
        {
          labelValue: "Destination Step Name*",
          name: "destinationStepName",
          formType: "select",
          options: steps.map(stepName => ({ name: stepName, value: stepName }))
        }
      ];
    } else {
      return [
        {
          labelValue: "Pattern*",
          name: "pattern",
          formType: "text"
        }
      ];
    }
  };

  const validateRuleForm = (values: IRuleFormValues) => {
    const errors = {} as IRuleFormValues;
    if (!values.pattern) {
      errors.pattern = "Please fill in a pattern.";
    }

    if (ruleType === RuleRuleTypeEnum.MATCH || ruleType === expectedProduct) {
      if (!values.destinationType) {
        errors.destinationType = "Please fill in a destination type.";
      }

      if (ruleType === expectedProduct) {
        if (!values.destinationSegmentName) {
          errors.destinationSegmentName =
            "Please fill in a destination segment name.";
        }
      }

      if (!values.destinationStepName) {
        errors.destinationStepName = "Please fill in a destination step name.";
      }
    }
    return errors;
  };

  const formConfig: IFormBuilderConfig = {
    dataTesthookId: "rule-edit-form",
    schema: getApprovalExecutionFormSchema(),
    permission: FormPermissions.EDIT,
    isLoading: false,
    validate: values => validateRuleForm(values),
    onSubmit: form => {
      updateRule(form as IRuleFormValues);
    },
    onChange: (_valid: boolean, form: any) => {
      setSelectedSegment(form.destinationSegmentName);
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
    buttonHandler: FormSubmitButtonHandlerTypes.MOUSEDOWN,
    alternateStyling: true
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
    }${rule.destinationPathPrefix ? " - " + rule.destinationPathPrefix : ""}`;
  };

  const ruleRow = (rule: IRule, index: number) => {
    return (
      <ItemTitle clickable={false}>
        <CollectionContainerSpan>{getRuleInfo(rule)}</CollectionContainerSpan>
        <ActionIconsContainer>
          <EditItemButton
            data-testhook-id={"edit-rule-" + index}
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
    );
  };

  const ruleForm = () => {
    return (
      <>
        {ruleType !== expectedProduct ? (
          <SelectionContainer>
            <label htmlFor="collectorType">Rule type:</label>
            <Select
              onChange={e => setRuleType(e.target.value as RuleRuleTypeEnum)}
              value={ruleType}
              name="ruleType"
              id="ruleType">
              <option value={"select"}>select...</option>
              {Object.keys(RuleRuleTypeEnum).map((val, key) => (
                <option key={"select-type-" + key} value={val}>
                  {val.toLowerCase()}
                </option>
              ))}
            </Select>
          </SelectionContainer>
        ) : null}
        {ruleType !== "select" ? formJSX : null}
      </>
    );
  };

  return (
    <>
      <ItemContainer>
        <CollectionContainerRow>
          <ItemContainerTitle>{title}</ItemContainerTitle>
          <AddItemButton data-testhook-id={"add-rule"} onClick={addRule}>
            <PlusIcon size={24} color={theme.layoutBuilder.iconColor} />
          </AddItemButton>
        </CollectionContainerRow>
        <CollectionContainerList>
          {rules.map((rule, index) => {
            return (
              <React.Fragment key={"rule-row-" + index}>
                {ruleToEdit === rule ? (
                  ruleForm()
                ) : (
                  <li>{ruleRow(rule, index)}</li>
                )}
              </React.Fragment>
            );
          })}
        </CollectionContainerList>
      </ItemContainer>
    </>
  );
};

export default RuleEditor;
