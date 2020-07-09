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
import {
  ActionIconsContainer,
  BaseActionButton,
  CollectionContainerSpan,
  CollectionContainerCard
} from "./Collection";
import {
  DetailsPanelType,
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../stores/LayoutEditorStore";
import EditIcon from "./Icons/EditIcon";
import JsonIcon from "./Icons/JsonIcon";

const LayoutTitle = styled(CollectionContainerCard)``;

const LayoutSection = styled.section`
  width: 100%;
  margin: 0 0 1rem;
`;

const EditLayoutButton = styled(BaseActionButton)``;

const Layout: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const onSelectLayout = (e: any) => {
    e.stopPropagation();
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.EDIT_LAYOUT
    });
  };

  const onShowJson = () => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.SHOW_JSON
    });
  }

  return (
    <>
      <LayoutSection data-testhook-id={"layout-edit"}>
        <LayoutTitle
          active={
            editorStoreContext.state.detailPanelMode ===
            DetailsPanelType.LAYOUT_DETAILS
          }>
          <CollectionContainerSpan>Layout</CollectionContainerSpan>
          <ActionIconsContainer>
            <EditLayoutButton
              data-testhook-id={"show-layout-json"}
              onClick={onShowJson}>
              <JsonIcon size={26} color={theme.layoutBuilder.iconColor} />
            </EditLayoutButton>
            <EditLayoutButton
              data-testhook-id={"edit-layout"}
              onClick={onSelectLayout}>
              <EditIcon size={31} color={theme.layoutBuilder.iconColor} />
            </EditLayoutButton>
          </ActionIconsContainer>
        </LayoutTitle>
      </LayoutSection>
    </>
  );
};

export default Layout;
