/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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

interface CollapsibleContainerBodyProps {
  collapsed: boolean;
}

const CollapsibleContainerBody = styled.main<CollapsibleContainerBodyProps>`
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

interface CollapseContainerComponentProps {
  children: React.ReactNode;
  collapsedByDefault: boolean;
  title: string;
  onCollapse?: () => boolean;
  onExpand?: () => boolean;
}

const CollapsibleContainerComponent: React.FC<CollapseContainerComponentProps> = ({
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
