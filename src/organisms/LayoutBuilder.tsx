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
import { PlusIcon } from "../atoms/Icons";
import EditIcon from "../atoms/Icons/EditIcon";
import RemoveIcon from "../atoms/Icons/RemoveIcon";

const LayoutItemContainer = styled.div`
  margin: 1rem 0 0;
  border: 1px solid #1779ba;
  display: flex;
  align-items: center;
  width: 100%;
`;

const LayoutItemContainerTitle = styled.header`
  position: relative;
  top: -0.75rem;
  left: 1rem;
  background-color: #f1f1f1;
  display: inline-flex;
`;

const LayoutItemContainerButton = styled.button`
  position: relative;
  top: -1rem;
  right: 1rem;
  background-color: #f1f1f1;
  border: 0;
`;

const LayoutItemContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const SegmentsContainer = styled(LayoutItemContainer)`
  flex-direction: column;
  border: 0;
  padding: 0 1rem;
  border: 1px solid #1779ba;
`;

const SegmentsContainerTitle = styled(LayoutItemContainerTitle)`
  font-size: 1.25rem;
  top: -1rem;
  color: #fff;
  background-color: #1779ba;
  padding: 0.25rem 2rem 0.4rem;
`;

const Segment = styled.section`
  width: 100%;
  padding: 0 1rem;
  margin: 0 0 1rem;
`;

const SegmentTitle = styled.header`
  padding: 0.5rem 1rem;
  width: 100%;
  margin: 0.5rem 0 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepsContainer = styled(LayoutItemContainer)`
  flex-direction: column;
  padding: 0 1rem 1rem;
  margin: 2rem 0 1rem;
  min-height: 10rem;
  background-color: #e0e0e0;
`;

const Step = styled.section`
  width: 100%;
  padding: 0 1rem;
  margin: 0 0 1rem;
`;

const StepTitle = styled.header`
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  width: 100%;
  margin: 0.5rem 0 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StepsContainerTitle = styled(LayoutItemContainerTitle)`
  top: -1rem;
  margin: 0 auto;
  padding: 0.25rem 1rem;
  border: 1px solid #1779ba;
`;

const AddSegmentButton = styled(LayoutItemContainerButton)`
  &:hover {
    cursor: pointer;
    transform: scale(0.8);
  }
`;

const AddStepButton = styled(LayoutItemContainerButton)`
  border: 1px solid #1779ba;
  padding: 0 0.65rem;

  &:hover {
    cursor: pointer;
    transform: scale(0.9);
  }
`;

const ActionIconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const BaseActionButton = styled.button`
  display: inline-flex;
  background: none;
  border: 0;

  &:hover {
    cursor: pointer;
    transform: scale(0.8);
  }
`;

const EditSegmentButton = styled(BaseActionButton)``;
const RemoveSegmentButton = styled(BaseActionButton)``;

const EditStepButton = styled(BaseActionButton)``;
const RemoveStepButton = styled(BaseActionButton)``;

interface ILayoutBuilderProps {
  data: any;
  onAddSegment: () => void;
  onAddStep: () => void;
  onEditSegment: () => void;
  onRemoveSegment: () => void;
  onEditStep: () => void;
  onRemoveStep: () => void;
}

const LayoutBuilder: React.FC<ILayoutBuilderProps> = props => {
  return (
    <SegmentsContainer>
      <LayoutItemContainerRow>
        <SegmentsContainerTitle>Segments</SegmentsContainerTitle>
        <AddSegmentButton onClick={props.onAddSegment}>
          <PlusIcon size={24} color={"#1779ba"} />
        </AddSegmentButton>
      </LayoutItemContainerRow>
      {props.data.segments.map((segment: any, segmentKey: any) => (
        <Segment key={segmentKey}>
          <SegmentTitle>
            <span>{segment.name}</span>
            <ActionIconsContainer>
              <EditSegmentButton onClick={props.onEditSegment}>
                <EditIcon size={30} color={"#1779ba"} />
              </EditSegmentButton>
              <RemoveSegmentButton onClick={props.onRemoveSegment}>
                <RemoveIcon size={24} color={"#1779ba"} />
              </RemoveSegmentButton>
            </ActionIconsContainer>
          </SegmentTitle>
          <StepsContainer>
            <LayoutItemContainerRow>
              <StepsContainerTitle>Steps</StepsContainerTitle>
              <AddStepButton onClick={props.onAddStep}>
                <PlusIcon size={20} color={"#1779ba"} />
              </AddStepButton>
            </LayoutItemContainerRow>
            {segment.steps &&
              segment.steps.map((step: any, stepKey: any) => (
                <Step key={stepKey}>
                  <StepTitle>
                    <span>{step.name}</span>
                    <ActionIconsContainer>
                      <EditStepButton onClick={props.onEditStep}>
                        <EditIcon size={26} color={"#1779ba"} />
                      </EditStepButton>
                      <RemoveStepButton onClick={props.onRemoveStep}>
                        <RemoveIcon size={20} color={"#1779ba"} />
                      </RemoveStepButton>
                    </ActionIconsContainer>
                  </StepTitle>
                </Step>
              ))}
          </StepsContainer>
        </Segment>
      ))}
    </SegmentsContainer>
  );
};

export default LayoutBuilder;
