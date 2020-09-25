/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
