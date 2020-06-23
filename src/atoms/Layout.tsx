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
import Input from "./Input";
import InputErrorLabel from "./InputErrorLabel";
import {
  ActionIconsContainer,
  BaseActionButton,
  CollectionContainerSpan
} from "./Collection";
import {
  DetailsPanelType,
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../stores/LayoutEditorStore";
import EditIcon from "./Icons/EditIcon";

interface ILayoutTitleProps {
  active: boolean;
}

const LayoutTitle = styled.header<ILayoutTitleProps>`
  border: 1px solid
    ${props =>
      props.active
        ? props.theme.layoutBuilder.stepTitleHoverBorderColor
        : "transparent"};
  font-size: 0.9rem;
  padding: 0.5rem;
  width: 100%;
  margin: 0.5rem 0 0;
  background-color: ${props => props.theme.layoutBuilder.stepTitleBgColor};
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
      ${props => props.theme.layoutBuilder.stepTitleHoverBorderColor};
  }
`;

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
              data-testhook-id={"edit-layout"}
              onClick={onSelectLayout}>
              <EditIcon size={26} color={theme.layoutBuilder.iconColor} />
            </EditLayoutButton>
          </ActionIconsContainer>
        </LayoutTitle>
      </LayoutSection>
    </>
  );
};

export default Layout;
