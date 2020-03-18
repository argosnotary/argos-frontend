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
import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import ChevronIcon from "./Icons/ChevronIcon";

const CollapsibleContainer = styled.section``;

const CollapsibleContainerHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.collapsibleContainer.headerBgColor};
`;

interface ICollapsibleContainerBodyProps {
  collapsed: boolean;
}

const CollapsibleContainerBody = styled.main<ICollapsibleContainerBodyProps>`
  border: ${props =>
    props.collapsed
      ? "none"
      : `1px solid ${props.theme.collapsibleContainer.bodyBorderColor}`};
  padding: ${props => (props.collapsed ? "0 1rem" : "1rem")};
  max-height: ${props => (props.collapsed ? 0 : "none")};
  overflow: hidden;
  transition: max-height, padding 0.2s ease-out;
`;

const CollapseButton = styled.button`
  background: none;
  border: 0;
  outline: 0;

  &:hover {
    cursor: pointer;
  }
`;

interface ICollapseContainerComponentProps {
  children: React.ReactNode;
  collapsedByDefault: boolean;
  title: string;
  onCollapse?: () => void;
}

const CollapsibleContainerComponent: React.FC<ICollapseContainerComponentProps> = ({
  children,
  collapsedByDefault,
  onCollapse,
  title
}) => {
  const [toggled, setToggled] = useState(collapsedByDefault);
  const theme = useContext(ThemeContext);

  return (
    <CollapsibleContainer>
      <CollapsibleContainerHeader>
        {title}
        <CollapseButton
          onClick={() => {
            if (onCollapse) {
              onCollapse();
            }

            setToggled(!toggled);
          }}
        >
          <ChevronIcon
            color={theme.collapsibleContainer.iconColor}
            size={16}
            transform={!toggled ? "rotate(180)" : ""}
          />
        </CollapseButton>
      </CollapsibleContainerHeader>
      <CollapsibleContainerBody collapsed={toggled}>
        {children}
      </CollapsibleContainerBody>
    </CollapsibleContainer>
  );
};

export default CollapsibleContainerComponent;
