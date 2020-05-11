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
import SegmentContainer from "./SegmentContainer";
import styled, { ThemeContext } from "styled-components";
import { PlusIcon } from "../../../../atoms/Icons";
import {
  LayoutItemContainer,
  LayoutItemContainerButton,
  LayoutItemContainerRow,
  LayoutItemContainerTitle,
  LayoutItemContainerList
} from "../../../../atoms/LayoutItemContainer";

const SegmentsContainer = styled(LayoutItemContainer)`
  flex-direction: column;
  border: 0;
  padding: 0 1rem;
  border: 1px solid
    ${props => props.theme.layoutBuilder.segmentContainerBorderColor};
`;

const SegmentsContainerTitle = styled(LayoutItemContainerTitle)`
  font-size: 1rem;
  top: -1rem;
  color: ${props => props.theme.layoutBuilder.segmentsContainerTitleColor};
  background-color: ${props =>
    props.theme.layoutBuilder.segmentContainerTitleBgColor};
  padding: 0.25rem 2rem 0.4rem;
`;

const AddSegmentButton = styled(LayoutItemContainerButton)`
  right: 0;

  &:hover {
    cursor: pointer;
    transform: scale(0.8);
  }
`;

const LayoutEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const onAddSegment = () => {
    const layoutElement = { name: "", steps: [] };
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.ADD_SEGMENT,
      layoutSegment: layoutElement
    });
  };

  const { layout } = editorStoreContext.state;

  return (
    <ul>
      <SegmentsContainer>
        <LayoutItemContainerRow>
          <SegmentsContainerTitle>Segments</SegmentsContainerTitle>
          <AddSegmentButton onClick={onAddSegment}>
            <PlusIcon size={24} color={theme.layoutBuilder.iconColor} />
          </AddSegmentButton>
        </LayoutItemContainerRow>
        <LayoutItemContainerList>
          {layout.layoutSegments
            ? layout.layoutSegments.map((segment, _key) => (
                <SegmentContainer key={segment.name} segment={segment} />
              ))
            : null}
        </LayoutItemContainerList>
      </SegmentsContainer>
    </ul>
  );
};

export default LayoutEditor;
