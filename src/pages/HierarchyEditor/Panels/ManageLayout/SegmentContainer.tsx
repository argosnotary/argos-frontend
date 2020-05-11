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
import styled from "styled-components";
import { ILayoutSegment, IStep } from "../../../../interfaces/ILayout";
import {
  LayoutEditorActionType,
  useLayoutEditorStore,
} from "./LayoutEditorStore";
import EditIcon from "../../../../atoms/Icons/EditIcon";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import {
  ActionIconsContainer,
  BaseActionButton,
  LayoutItemContainer,
  LayoutItemContainerButton,
  LayoutItemContainerRow,
  LayoutItemContainerTitle,
} from "../../../../atoms/LayoutItemContainer";
import { PlusIcon } from "../../../../atoms/Icons";
import StepContainer from "./StepContainer";
import LayoutElementNameEditor from "./LayoutElementNameEditor";
import InputErrorLabel from "../../../../atoms/InputErrorLabel";
import Input from "../../../../atoms/Input";

const SegmentTitle = styled.header`
  padding: 0.5rem 1rem;
  width: 100%;
  margin: 0.2rem 0 0;
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

const StepsContainer = styled(LayoutItemContainer)`
  flex-direction: column;
  padding: 0 1rem 1rem;
  margin: 1rem 0;
  min-height: 10rem;
  background-color: #e0e0e0;
`;

const StepsContainerTitle = styled(LayoutItemContainerTitle)`
  top: -1rem;
  margin: 0 auto;
  padding: 0.25rem 1rem;
  border: 1px solid #1779ba;
`;

const AddStepButton = styled(LayoutItemContainerButton)`
  border: 1px solid #1779ba;
  padding: 0 0.65rem;

  &:hover {
    cursor: pointer;
    transform: scale(0.9);
  }
`;

const EditSegmentButton = styled(BaseActionButton)``;
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

  const onEditSegment = () => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.EDIT_LAYOUT_ELEMENT,
      layoutElement: segment,
    });
  };

  const onDeleteSegment = () => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_SEGMENT,
      layoutElement: segment,
    });
  };

  const onAddStep = () => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.SELECT_LAYOUT_ELEMENT,
      layoutElement: segment,
    });
    const newStep = { name: "" } as IStep;
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.ADD_STEP,
      layoutElement: newStep,
    });
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.EDIT_LAYOUT_ELEMENT,
      layoutElement: newStep,
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
        <SegmentTitle>
          {segment === editorStoreContext.state.activeEditLayoutElement ? (
            <LayoutElementNameEditor
              currentName={segment.name}
              nameExists={segmentNameExists}
            />
          ) : (
            <>
              <span>{segment.name}</span>
              <ActionIconsContainer>
                <EditSegmentButton onClick={onEditSegment}>
                  <EditIcon size={30} color={"#1779ba"} />
                </EditSegmentButton>
                <RemoveSegmentButton onClick={onDeleteSegment}>
                  <RemoveIcon size={24} color={"#1779ba"} />
                </RemoveSegmentButton>
              </ActionIconsContainer>
            </>
          )}
        </SegmentTitle>
      </SegmentContainerLi>
      <StepsContainer>
        <LayoutItemContainerRow>
          <StepsContainerTitle>Steps</StepsContainerTitle>
          <AddStepButton onClick={onAddStep}>
            <PlusIcon size={20} color={"#1779ba"} />
          </AddStepButton>
        </LayoutItemContainerRow>
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
