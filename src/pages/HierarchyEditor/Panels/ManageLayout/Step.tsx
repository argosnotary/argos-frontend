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
import React, { useContext } from "react";
import { ILayoutSegment, IStep } from "../../../../interfaces/ILayout";
import EditIcon from "../../../../atoms/Icons/EditIcon";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import styled, { ThemeContext } from "styled-components";
import {
  ActionIconsContainer,
  BaseActionButton,
  CollectionContainerSpan
} from "../../../../atoms/Collection";
import LayoutElementNameEditor from "./LayoutElementNameEditor";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "./LayoutEditorStore";
import Input from "../../../../atoms/Input";
import InputErrorLabel from "../../../../atoms/InputErrorLabel";

interface IStepTitleProps {
  active: boolean;
}

const StepTitle = styled.header<IStepTitleProps>`
  border: 1px solid
    ${props =>
      props.active
        ? props.theme.layoutBuilder.stepTitleHoverBorderColor
        : "transparent"};
  font-size: 0.9rem;
  padding: 0.5rem;
  width: 100%;
  margin: 0.5rem 0 0;
  background-color: ${props => props.theme.layoutBuilder.stepTitleBgColor};
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    margin: 0 0.5rem;
  }

  ${Input} {
    margin: 0;
  }

  ${InputErrorLabel} {
    margin: 0.5rem 0 0;
  }

  &:hover {
    cursor: pointer;
    border: 1px solid
      ${props => props.theme.layoutBuilder.stepTitleHoverBorderColor};
  }
`;

const StepSection = styled.section`
  width: 100%;
  margin: 0 0 1rem;
`;

const EditStepButton = styled(BaseActionButton)``;
const RemoveStepButton = styled(BaseActionButton)``;

interface IStepContainer {
  segment: ILayoutSegment;
  step: IStep;
  index: number;
}

const Step: React.FC<IStepContainer> = ({ step, index, segment }) => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const onEditStep = (e: any) => {
    if (step !== editorStoreContext.state.activeEditLayoutElement?.step) {
      e.stopPropagation();
      editorStoreContext.dispatch({
        type: LayoutEditorActionType.EDIT_LAYOUT_ELEMENT,
        layoutSegment: segment,
        layoutStep: step
      });
    }
  };

  const onDeleteStep = (e: any) => {
    e.stopPropagation();
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_STEP,
      layoutStep: step,
      layoutSegment: segment
    });
  };

  const stepNameExists = (stepName: string): boolean => {
    return (
      segment.steps &&
      segment.steps.findIndex(
        stepPredicate => stepPredicate.name === stepName
      ) >= 0
    );
  };

  const onSelectStep = (e: any) => {
    e.stopPropagation();
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.SELECT_STEP,
      layoutStep: step,
      layoutSegment: segment
    });
  };

  return (
    <>
      <StepSection
        data-testhook-id={segment.name + "-" + index + "-edit-step"}
        onClick={onEditStep}>
        <StepTitle
          active={
            step === editorStoreContext.state.selectedLayoutElement?.step ||
            step === editorStoreContext.state.activeEditLayoutElement?.step
          }>
          {step === editorStoreContext.state.activeEditLayoutElement?.step ? (
            <LayoutElementNameEditor
              currentName={step.name}
              nameExists={stepNameExists}
              dataTesthookId={segment.name + "-" + index + "-name-form"}
            />
          ) : (
            <>
              <CollectionContainerSpan>{step.name}</CollectionContainerSpan>
              <ActionIconsContainer>
                <EditStepButton
                  data-testhook-id={segment.name + "-" + index + "-select-step"}
                  onClick={onSelectStep}>
                  <EditIcon size={26} color={theme.layoutBuilder.iconColor} />
                </EditStepButton>
                <RemoveStepButton
                  data-testhook-id={segment.name + "-" + index + "-delete-step"}
                  onClick={onDeleteStep}>
                  <RemoveIcon size={20} color={theme.layoutBuilder.iconColor} />
                </RemoveStepButton>
              </ActionIconsContainer>
            </>
          )}
        </StepTitle>
      </StepSection>
    </>
  );
};

export default Step;
