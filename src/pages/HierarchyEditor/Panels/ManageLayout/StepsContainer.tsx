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

import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "./LayoutEditorStore";
import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { PlusIcon } from "../../../../atoms/Icons";
import {
  CollectionContainer,
  CollectionContainerButton,
  CollectionContainerRow,
  CollectionContainerTitle
} from "../../../../atoms/Collection";
import { ILayoutSegment, IStep } from "../../../../interfaces/ILayout";
import Step from "./Step";

const StepsContainerSection = styled(CollectionContainer)`
  flex-direction: column;
  padding: 0 1rem 1rem;
  margin: 1rem 0;
  min-height: 10rem;
  background-color: ${props => props.theme.layoutBuilder.stepContainerBgColor};
`;

const StepsContainerTitle = styled(CollectionContainerTitle)`
  top: -1rem;
  margin: 0 auto;
  padding: 0.25rem 1rem;
  border: 1px solid
    ${props => props.theme.layoutBuilder.stepContainerTitleBorderColor};
`;

const AddStepButton = styled(CollectionContainerButton)`
  border: 1px solid
    ${props => props.theme.layoutBuilder.addStepButtonBorderColor};
  padding: 0 0.65rem;

  &:hover {
    cursor: pointer;
    transform: scale(0.9);
  }
`;

interface IStepsContainerProps {
  segment: ILayoutSegment;
  index: number;
}

const StepsContainer: React.FC<IStepsContainerProps> = ({ segment, index }) => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const onAddStep = () => {
    const newStep = { name: "" } as IStep;
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.ADD_STEP,
      layoutSegment: segment,
      layoutStep: newStep
    });
  };

  return (
    <ul>
      <StepsContainerSection>
        <CollectionContainerRow>
          <StepsContainerTitle>Steps</StepsContainerTitle>
          <AddStepButton
            data-testhook-id={"segment" + index + "-add-step"}
            onClick={onAddStep}>
            <PlusIcon size={20} color={theme.layoutBuilder.iconColor} />
          </AddStepButton>
        </CollectionContainerRow>
        {segment.steps &&
          segment.steps.map((step: IStep, segmentIndex: number) => (
            <Step
              key={"stepContainer" + segmentIndex}
              step={step}
              index={segmentIndex}
              segment={segment}
            />
          ))}
      </StepsContainerSection>
    </ul>
  );
};

export default StepsContainer;
