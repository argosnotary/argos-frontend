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
import React, { useState, useContext, useEffect } from "react";
import styled, { ThemeContext } from "styled-components";
import ChevronIcon from "./Icons/ChevronIcon";

const CollapsibleContainer = styled.section`
  &.shake {
    animation: shake 0.5s;
    animation-iteration-count: 1;
  }

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`;

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

export const CollapseButton = styled.button`
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
  onCollapse?: () => boolean;
  onExpand?: () => boolean;
}

const CollapsibleContainerComponent: React.FC<ICollapseContainerComponentProps> = ({
  children,
  collapsedByDefault,
  onCollapse,
  onExpand,
  title
}) => {
  const [collapsed, setCollapsed] = useState(collapsedByDefault);
  const theme = useContext(ThemeContext);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setCollapsed(collapsedByDefault);
  }, [collapsedByDefault]);

  const handleExpand = () => {
    if (onExpand) {
      if (onExpand()) {
        setCollapsed(false);
      } else {
        setShake(true);
      }
    } else {
      setCollapsed(false);
    }
  };

  const handleCollapse = () => {
    if (onCollapse) {
      if (onCollapse()) {
        setCollapsed(true);
      } else {
        setShake(true);
      }
    } else {
      setCollapsed(true);
    }
  };

  return (
    <CollapsibleContainer
      className={shake ? "shake" : ""}
      onAnimationEnd={() => {
        setShake(false);
      }}>
      <CollapsibleContainerHeader>
        {title}
        <CollapseButton
          onClick={() => {
            if (!collapsed) {
              handleCollapse();
            } else {
              handleExpand();
            }
          }}>
          <ChevronIcon
            color={theme.collapsibleContainer.iconColor}
            size={16}
            transform={!collapsed ? "rotate(180)" : ""}
          />
        </CollapseButton>
      </CollapsibleContainerHeader>
      <CollapsibleContainerBody collapsed={collapsed}>
        {children}
      </CollapsibleContainerBody>
    </CollapsibleContainer>
  );
};

export default CollapsibleContainerComponent;
