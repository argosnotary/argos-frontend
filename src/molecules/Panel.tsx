import React from "react";
import styled from "styled-components";

import { EnlargeIcon, ShrinkIcon } from "../atoms/Icons";
import useShrinkToggle from "../hooks/useShrinkToggle";

interface ISinglePanelContainerProps {
  disableFlexGrow?: boolean;
  width: string;
  shrink: boolean;
}

const SinglePanelContainer = styled.section<ISinglePanelContainerProps>`
  flex: ${props => (props.shrink ? "0 0 1rem" : `1 1 ${props.width}`)};
  flex-grow: ${props =>
    props.disableFlexGrow ? "0" : props.shrink ? "0" : "1"};
`;

interface IPanelBodyProps {
  last?: boolean;
  shrink: boolean;
}

const PanelBody = styled.main<IPanelBodyProps>`
  height: 100vh;
  background-color: ${props => props.theme.layoutPage.panel.bgColor};
  margin: ${props => (!props.last ? "0 0 1rem 1rem" : "0 1rem 0 1rem")};
  padding: 1rem;
  display: flex;
  flex-direction: column;

  > * {
    display: ${props => (props.shrink ? "none" : "initial")};
  }
`;

interface IPanelProps {
  title?: string;
  last?: boolean;
  resizable?: boolean;
  disableFlexGrow?: boolean;
  width: string;
  children: React.ReactNode;
}

interface IPanelHeaderProps {
  last?: boolean;
}

const PanelHeader = styled.header<IPanelHeaderProps>`
  margin: ${props => (!props.last ? "1rem 0 0 1rem" : "1rem 1rem 0 1rem")};
  padding: 0.5rem 1rem;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 2.5rem;
  font-weight: bolder;

  > svg:hover {
    fill-opacity: 0.8;
    cursor: pointer;
  }
`;

const PanelTitle = styled.p`
  justify-self: center;
`;

export const PanelsContainer = styled.section`
  width: 100vw;
`;

export const Panel: React.FC<IPanelProps> = ({
  title,
  width,
  children,
  last,
  disableFlexGrow,
  resizable
}) => {
  const [shrink, setShrinkState] = useShrinkToggle();

  return (
    <SinglePanelContainer
      width={width}
      shrink={shrink}
      disableFlexGrow={disableFlexGrow}
    >
      <PanelHeader last={last}>
        {resizable ? (
          <>
            {!shrink ? (
              <>
                <PanelTitle>{title}</PanelTitle>
                <ShrinkIcon
                  size={16}
                  color={"#1779ba"}
                  onClick={() => setShrinkState(!shrink)}
                />
              </>
            ) : (
              <EnlargeIcon
                size={16}
                color={"#1779ba"}
                onClick={() => setShrinkState(!shrink)}
              />
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
