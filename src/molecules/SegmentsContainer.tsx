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
} from "../stores/LayoutEditorStore";
import React, { useContext } from "react";
import Segment from "../atoms/Segment";
import styled, { ThemeContext } from "styled-components";
import { PlusIcon } from "../atoms/Icons";
import {
  CollectionContainer,
  CollectionContainerButton,
  CollectionContainerRow,
  CollectionContainerTitle,
  CollectionContainerList
} from "../atoms/Collection";
import { ILayoutSegment } from "../interfaces/ILayout";

const SegmentsContainerSection = styled(CollectionContainer)`
  margin: 1rem 0;
  min-height: 18.8rem;
`;

const SegmentsContainerTitle = styled(CollectionContainerTitle)``;

const AddSegmentButton = styled(CollectionContainerButton)``;

const SegmentsContainer: React.FC = () => {
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
      <SegmentsContainerSection>
        <CollectionContainerRow>
          <SegmentsContainerTitle>Segments</SegmentsContainerTitle>
          <AddSegmentButton
            data-testhook-id={"add-segment"}
            onClick={onAddSegment}>
            <PlusIcon size={24} color={theme.layoutBuilder.iconColor} />
          </AddSegmentButton>
        </CollectionContainerRow>
        <CollectionContainerList>
          {layout.layoutSegments
            ? layout.layoutSegments.map(
                (segment: ILayoutSegment, index: number) => (
                  <Segment index={index} key={segment.name} segment={segment} />
                )
              )
            : null}
        </CollectionContainerList>
      </SegmentsContainerSection>
    </ul>
  );
};

export default SegmentsContainer;
