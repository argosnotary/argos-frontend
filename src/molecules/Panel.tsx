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

import { EnlargeIcon, ShrinkIcon } from "../atoms/Icons";
import useShrinkToggle from "../hooks/useShrinkToggle";

interface ISinglePanelContainerProps {
  disableFlexGrow?: boolean;
  width?: string;
  maxWidth?: string;
  shrink: boolean;
}

const SinglePanelContainer = styled.section<ISinglePanelContainerProps>`
  flex: ${props => (props.shrink ? "0 0 1rem" : `1 1 ${props.width}`)};
  flex-grow: ${props =>
    props.disableFlexGrow ? "0" : props.shrink ? "0" : "1"};
  ${props => (!props.shrink ? "min-width: 0;" : null)};
  max-width: ${props => (props.maxWidth ? props.maxWidth : "none")};
`;

interface IPanelBodyProps {
  last?: boolean;
  shrink: boolean;
}

const PanelBody = styled.main<IPanelBodyProps>`
  overflow-y: auto;
  height: calc(100vh - 7.7rem);
  background-color: ${props => props.theme.layoutPage.panel.bgColor};
  margin: ${props => (!props.last ? "0 0 1rem 1rem" : "0 1rem 0 1rem")};
  padding: 1rem;
  display: flex;
  flex-direction: column;

  > * {
    display: ${props => (props.shrink ? "none" : "")};
  }
`;

interface IPanelProps {
  title?: string;
  last?: boolean;
  resizable?: boolean;
  disableFlexGrow?: boolean;
  width?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

interface IPanelHeaderProps {
  last?: boolean;
}

const PanelHeader = styled.header<IPanelHeaderProps>`
  margin: ${props => (!props.last ? "1rem 0 0 1rem" : "1rem 1rem 0 1rem")};
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.layoutPage.panel.headerBgColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 2.5rem;
  font-weight: bolder;
`;

const PanelTitle = styled.p`
  justify-self: center;
`;

interface IPanelIconContainer {
  shrink: boolean;
}

const PanelIconContainer = styled.div<IPanelIconContainer>`
  padding: ${props => (!props.shrink ? "0 0 0 1rem" : "0")};
  display: flex;

  &:hover {
    cursor: pointer;
  }

  > svg:hover {
    fill-opacity: 0.8;
  }
`;

export const PanelsContainer = styled.section`
  width: 100vw;
`;

export const Panel: React.FC<IPanelProps> = ({
  title,
  width,
  maxWidth,
  children,
  last,
  disableFlexGrow,
  resizable
}) => {
  const [shrink, setShrinkState] = useShrinkToggle();
  const theme = useContext(ThemeContext);

  return (
    <SinglePanelContainer
      width={width}
      maxWidth={maxWidth}
      shrink={shrink}
      disableFlexGrow={disableFlexGrow}>
      <PanelHeader last={last}>
        {resizable ? (
          <>
            {!shrink ? (
              <>
                <PanelTitle>{title}</PanelTitle>
                <PanelIconContainer
                  onClick={() => setShrinkState(!shrink)}
                  shrink={shrink}>
                  <ShrinkIcon
                    size={16}
                    color={theme.panel.icons.shrinkIcon.color}
                  />
                </PanelIconContainer>
              </>
            ) : (
              <PanelIconContainer
                onClick={() => setShrinkState(!shrink)}
                shrink={shrink}>
                <EnlargeIcon
                  size={16}
                  color={theme.panel.icons.enlargeIcon.color}
                />
              </PanelIconContainer>
            )}
          </>
        ) : (
          <PanelTitle>{title}</PanelTitle>
        )}
      </PanelHeader>
      <PanelBody shrink={shrink} last={last}>
        {children}
      </PanelBody>
    </SinglePanelContainer>
  );
};
