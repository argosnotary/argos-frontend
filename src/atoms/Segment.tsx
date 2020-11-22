/*
 * Copyright (C) 2020 Argos Notary
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
import {
  BaseActionButton,
  CollectionContainerSpan,
  ActionIconsContainer,
  CollectionContainerCard
} from "./Collection";
import { ILayoutSegment } from "../interfaces/ILayout";
import {
  useLayoutEditorStore,
  LayoutEditorActionType
} from "../stores/LayoutEditorStore";
import LayoutElementNameEditor from "../pages/HierarchyEditor/Panels/ManageLayout/LayoutElementNameEditor";
import RemoveIcon from "./Icons/RemoveIcon";
import StepsContainer from "../molecules/StepsContainer";

const SegmentTitle = styled(CollectionContainerCard)``;

const RemoveSegmentButton = styled(BaseActionButton)``;

const SegmentContainerLi = styled.li`
  width: 100%;
  margin: 0 0 1rem;
`;

interface ISegmentContainerProps {
  segment: ILayoutSegment;
  index: number;
}

const Segment: React.FC<ISegmentContainerProps> = ({ segment, index }) => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const onEditSegment = () => {
    if (segment !== editorStoreContext.state.activeEditLayoutElement?.segment) {
      editorStoreContext.dispatch({
        type: LayoutEditorActionType.EDIT_LAYOUT_ELEMENT,
        layoutSegment: segment
      });
    }
  };

  const onDeleteSegment = () => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_SEGMENT,
      layoutSegment: segment
    });
  };

  const segmentNameExists = (segmentName: string): boolean => {
    return (
      editorStoreContext.state.layout.layoutSegments &&
      editorStoreContext.state.layout.layoutSegments.findIndex(
        (seg: ILayoutSegment) => seg.name === segmentName
      ) >= 0
    );
  };

  return (
    <>
      <SegmentContainerLi>
        <SegmentTitle
          clickable={true}
          data-testhook-id={"segment" + index + "-edit"}
          onClick={onEditSegment}>
          {editorStoreContext.state.activeEditLayoutElement?.step ===
            undefined &&
          segment ===
            editorStoreContext.state.activeEditLayoutElement?.segment ? (
            <LayoutElementNameEditor
              currentName={segment.name}
              nameExists={segmentNameExists}
              dataTesthookId={"segment" + index + "-name-form"}
            />
          ) : (
            <>
              <CollectionContainerSpan>{segment.name}</CollectionContainerSpan>
              <ActionIconsContainer>
                <RemoveSegmentButton
                  data-testhook-id={"segment" + index + "-delete"}
                  onClick={onDeleteSegment}>
                  <RemoveIcon size={24} color={theme.layoutBuilder.iconColor} />
                </RemoveSegmentButton>
              </ActionIconsContainer>
            </>
          )}
        </SegmentTitle>
      </SegmentContainerLi>
      <StepsContainer segment={segment} index={index} />
    </>
  );
};

export default Segment;
