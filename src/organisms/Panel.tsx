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
import React, { useContext, useState } from "react";
import styled, { ThemeContext } from "styled-components";

import { EnlargeIcon } from "../atoms/Icons";

interface PanelContainerProps {
  disableFlexGrow?: boolean;
  width?: string;
  maxWidth?: string;
  shrink: boolean;
}

const PanelContainer = styled.section<PanelContainerProps>`
  flex: ${props => (props.shrink ? "0 0 1rem" : `1 1 ${props.width}`)};
  flex-grow: ${props => (props.disableFlexGrow ? "0" : props.shrink ? "0" : "1")};
  ${props => (!props.shrink ? "min-width: 0;" : null)};
  max-width: ${props => (props.maxWidth ? props.maxWidth : "none")};
  margin: 0;
`;

interface PanelBodyProps {
  last?: boolean;
  shrink: boolean;
}

const PanelBody = styled.main<PanelBodyProps>`
  overflow-y: auto;
  height: calc(100vh - 7.7rem);
  background-color: ${props => props.theme.panel.bgColor};
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;

  > * {
    display: ${props => (props.shrink ? "none" : "")};
  }
`;

interface PanelProps {
  title?: string;
  last?: boolean;
  resizable?: boolean;
  disableFlexGrow?: boolean;
  width?: string;
  maxWidth?: string;
  children: React.ReactNode;
  header?: boolean;
}

interface PanelHeaderProps {
  last?: boolean;
}

const PanelHeader = styled.h1<PanelHeaderProps>`
  border-bottom: 1px solid ${props => props.theme.PageHeader.bottomBorderColor};
  padding: 1rem 0 1.25rem;
  margin: 0 0 0.6rem;
  background-color: ${props => props.theme.panel.headerBgColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 2.5rem;
  font-weight: bolder;
`;

const PanelTitle = styled.p`
  justify-self: center;
`;

interface PanelIconContainer {
  shrink: boolean;
}

const PanelIconContainer = styled.div<PanelIconContainer>`
  padding: ${props => (!props.shrink ? "0 0 0 1rem" : "0")};
  display: flex;

  &:hover {
    cursor: pointer;
  }

  > svg:hover {
    fill-opacity: 0.8;
  }
`;

export function Panel(props: PanelProps): React.ReactElement {
  const { title, width, maxWidth, children, last, disableFlexGrow, resizable, header = true } = props;
  const [shrink, setShrinkState] = useState(false);
  const theme = useContext(ThemeContext);

  return (
    <PanelContainer width={width} maxWidth={maxWidth} shrink={shrink} disableFlexGrow={disableFlexGrow}>
      {header ? (
        <PanelHeader last={last}>
          {resizable ? (
            <>
              {!shrink ? (
                <>
                  <PanelTitle>{title}</PanelTitle>
                  <PanelIconContainer onClick={() => setShrinkState(!shrink)} shrink={shrink} />
                </>
              ) : (
                <PanelIconContainer onClick={() => setShrinkState(!shrink)} shrink={shrink}>
                  <EnlargeIcon size={16} color={theme.panel.icons.enlargeIcon.color} />
                </PanelIconContainer>
              )}
            </>
          ) : (
            <PanelTitle>{title}</PanelTitle>
          )}
        </PanelHeader>
      ) : null}
      <PanelBody shrink={shrink} last={last}>
        {!shrink ? children : null}
      </PanelBody>
    </PanelContainer>
  );
}
