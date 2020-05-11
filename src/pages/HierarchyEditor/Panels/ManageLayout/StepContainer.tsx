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
import { ILayoutSegment, IStep } from "../../../../interfaces/ILayout";
import EditIcon from "../../../../atoms/Icons/EditIcon";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import styled from "styled-components";
import {
  ActionIconsContainer,
  BaseActionButton,
} from "../../../../atoms/LayoutItemContainer";
import LayoutElementNameEditor from "./LayoutElementNameEditor";
import {
  LayoutEditorActionType,
  useLayoutEditorStore,
} from "./LayoutEditorStore";
import Input from "../../../../atoms/Input";
import InputErrorLabel from "../../../../atoms/InputErrorLabel";

const StepTitle = styled.header`
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  width: 100%;
  margin: 0.5rem 0 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${Input} {
    margin: 0;
  }

  ${InputErrorLabel} {
    margin: 0.5rem 0 0;
  }
`;

const Step = styled.section`
  width: 100%;
  margin: 0 0 1rem;
`;

const EditStepButton = styled(BaseActionButton)``;
const RemoveStepButton = styled(BaseActionButton)``;

interface IStepContainer {
  segment: ILayoutSegment;
  step: IStep;
  stepKey: string;
}

const StepContainer: React.FC<IStepContainer> = ({
  step,
  stepKey,
  segment,
}) => {
  const editorStoreContext = useLayoutEditorStore();

  const onEditStep = (e: any) => {
    e.stopPropagation();
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.EDIT_LAYOUT_ELEMENT,
      layoutElement: step,
    });
  };

  const onDeleteStep = (e: any) => {
    e.stopPropagation();
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.SELECT_LAYOUT_ELEMENT,
      layoutElement: segment,
    });
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_STEP,
      layoutElement: step,
    });
  };

  const stepNameExists = (stepName: string): boolean => {
    return (
      segment.steps &&
      segment.steps.findIndex((step) => step.name === stepName) >= 0
    );
  };

  const onSelectStep = (e: any) => {
    e.stopPropagation();
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.SELECT_LAYOUT_ELEMENT,
      layoutElement: step,
    });
  };

  return (
    <>
      <Step key={stepKey} onClick={onSelectStep}>
        <StepTitle>
          {step === editorStoreContext.state.activeEditLayoutElement ? (
            <LayoutElementNameEditor
              currentName={step.name}
              nameExists={stepNameExists}
            />
          ) : (
            <>
              <span>{step.name}</span>
              <ActionIconsContainer>
                <EditStepButton onClick={onEditStep}>
                  <EditIcon size={26} color={"#1779ba"} />
                </EditStepButton>
                <RemoveStepButton onClick={onDeleteStep}>
                  <RemoveIcon size={20} color={"#1779ba"} />
                </RemoveStepButton>
              </ActionIconsContainer>
            </>
          )}
        </StepTitle>
      </Step>
    </>
  );
};

export default StepContainer;
