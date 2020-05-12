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
import styled, { ThemeContext } from "styled-components";
import { ILayoutSegment, IStep } from "../../../../interfaces/ILayout";
import {
  LayoutEditorActionType,
  useLayoutEditorStore,
} from "./LayoutEditorStore";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import {
  ActionIconsContainer,
  BaseActionButton,
  CollectionContainer,
  CollectionContainerButton,
  CollectionContainerRow,
  CollectionContainerTitle,
} from "../../../../atoms/Collection";
import { PlusIcon } from "../../../../atoms/Icons";
import StepContainer from "./StepContainer";
import LayoutElementNameEditor from "./LayoutElementNameEditor";
import InputErrorLabel from "../../../../atoms/InputErrorLabel";
import Input from "../../../../atoms/Input";

const SegmentTitle = styled.header`
  border: 1px solid transparent;
  box-sizing: border-box;
  padding: 0.5rem;
  width: 100%;
  margin: 0.2rem 0 0;
  background-color: ${(props) => props.theme.layoutBuilder.segmentTitleBgColor};

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
      ${(props) => props.theme.layoutBuilder.segmentTitleHoverBorderColor};
  }
`;

const StepsContainer = styled(CollectionContainer)`
  flex-direction: column;
  padding: 0 1rem 1rem;
  margin: 1rem 0;
  min-height: 10rem;
  background-color: ${(props) =>
    props.theme.layoutBuilder.stepContainerBgColor};
`;

const StepsContainerTitle = styled(CollectionContainerTitle)`
  top: -1rem;
  margin: 0 auto;
  padding: 0.25rem 1rem;
  border: 1px solid
    ${(props) => props.theme.layoutBuilder.stepContainerTitleBorderColor};
`;

const AddStepButton = styled(CollectionContainerButton)`
  border: 1px solid
    ${(props) => props.theme.layoutBuilder.addStepButtonBorderColor};
  padding: 0 0.65rem;

  &:hover {
    cursor: pointer;
    transform: scale(0.9);
  }
`;

const RemoveSegmentButton = styled(BaseActionButton)``;

const SegmentContainerLi = styled.li`
  width: 100%;
  margin: 0 0 1rem;
`;

interface ISegmentContainerProps {
  segment: ILayoutSegment;
}

const SegmentContainer: React.FC<ISegmentContainerProps> = ({ segment }) => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const onEditSegment = () => {
    if (segment !== editorStoreContext.state.activeEditLayoutElement?.segment) {
      editorStoreContext.dispatch({
        type: LayoutEditorActionType.EDIT_LAYOUT_ELEMENT,
        layoutSegment: segment,
      });
    }
  };

  const onDeleteSegment = () => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_SEGMENT,
      layoutSegment: segment,
    });
  };

  const onAddStep = () => {
    const newStep = { name: "" } as IStep;
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.ADD_STEP,
      layoutSegment: segment,
      layoutStep: newStep,
    });
  };

  const segmentNameExists = (segmentName: string): boolean => {
    return (
      editorStoreContext.state.layout.layoutSegments &&
      editorStoreContext.state.layout.layoutSegments.findIndex(
        (segment) => segment.name === segmentName
      ) >= 0
    );
  };

  return (
    <>
      <SegmentContainerLi>
        <SegmentTitle onClick={onEditSegment}>
          {editorStoreContext.state.activeEditLayoutElement?.step ===
            undefined &&
          segment ===
            editorStoreContext.state.activeEditLayoutElement?.segment ? (
            <LayoutElementNameEditor
              currentName={segment.name}
              nameExists={segmentNameExists}
            />
          ) : (
            <>
              <span>{segment.name}</span>
              <ActionIconsContainer>
                <RemoveSegmentButton onClick={onDeleteSegment}>
                  <RemoveIcon size={24} color={theme.layoutBuilder.iconColor} />
                </RemoveSegmentButton>
              </ActionIconsContainer>
            </>
          )}
        </SegmentTitle>
      </SegmentContainerLi>
      <StepsContainer>
        <CollectionContainerRow>
          <StepsContainerTitle>Steps</StepsContainerTitle>
          <AddStepButton onClick={onAddStep}>
            <PlusIcon size={20} color={theme.layoutBuilder.iconColor} />
          </AddStepButton>
        </CollectionContainerRow>
        {segment.steps &&
          segment.steps.map((step: IStep, stepKey: any) => (
            <StepContainer
              key={stepKey}
              step={step}
              stepKey={stepKey}
              segment={segment}
            />
          ))}
      </StepsContainer>
    </>
  );
};

export default SegmentContainer;
