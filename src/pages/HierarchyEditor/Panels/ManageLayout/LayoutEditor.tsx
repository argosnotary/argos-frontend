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
import React from "react";
import SegmentContainer from "./SegmentContainer";
import styled from "styled-components";
import { PlusIcon } from "../../../../atoms/Icons";
import {
  LayoutItemContainer,
  LayoutItemContainerButton,
  LayoutItemContainerRow,
  LayoutItemContainerTitle
} from "./CommonStyle";

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

const AddSegmentButton = styled(LayoutItemContainerButton)`
  &:hover {
    cursor: pointer;
    transform: scale(0.8);
  }
`;

const LayoutEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const onAddSegment = () => {
    const layoutElement = { name: "", steps: [] };
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.ADD_SEGMENT,
      layoutElement: layoutElement
    });
  };

  const layout = editorStoreContext.state.layout;

  return (
    <>
      <SegmentsContainer>
        <LayoutItemContainerRow>
          <SegmentsContainerTitle>Segments</SegmentsContainerTitle>
          <AddSegmentButton onClick={onAddSegment}>
            <PlusIcon size={24} color={"#1779ba"} />
          </AddSegmentButton>
        </LayoutItemContainerRow>
        <ul>
          {layout.layoutSegments
            ? layout.layoutSegments.map((segment, _key) => (
                <SegmentContainer key={segment.name} segment={segment} />
              ))
            : null}
        </ul>
      </SegmentsContainer>
    </>
  );
};

export default LayoutEditor;
