import React from "react";
import { Panel } from "./Panel";
import styled from "styled-components";

export default {
  title: "Panels",
};

const DemoBackground = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #e0e0e0;
`;

const StoryContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  height: 100vh;
`;

export const defaultPanel = () => (
  <DemoBackground>
    <StoryContainer>
      <Panel
        resizable={false}
        width={"50vw"}
        title={"Default panel"}
        disableFlexGrow={true}
        last={true}
      >
        &nbsp;
      </Panel>
    </StoryContainer>
  </DemoBackground>
);

export const resizablePanel = () => (
  <DemoBackground>
    <StoryContainer>
      <Panel
        resizable={true}
        width={"50vw"}
        title={"Resizable panel"}
        disableFlexGrow={true}
        last={true}
      >
        &nbsp;
      </Panel>
    </StoryContainer>
  </DemoBackground>
);
