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
import React from "react";
import styled from "styled-components";

import { Panel } from "./Panel";
import LayoutBuilder from "../organisms/LayoutBuilder";

export default {
  title: "LayoutEditor",
};

const dummyData = {
  segments: [
    { name: "Segment A", steps: [{ name: "Step A" }, { name: "Step B" }] },
    { name: "Segment B" },
  ],
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

export const defaultState = () => (
  <DemoBackground>
    <StoryContainer>
      <Panel
        resizable={false}
        width={"50vw"}
        title={"Default panel"}
        disableFlexGrow={true}
        last={true}
      >
        <LayoutBuilder
          data={dummyData}
          onAddSegment={() => console.log("Add segment")}
          onAddStep={() => console.log("Show add step panel")}
          onEditSegment={() => console.log("edit segment")}
          onRemoveSegment={() => console.log("remove segment")}
          onEditStep={() => console.log("edit step")}
          onRemoveStep={() => console.log("remove step")}
        />
      </Panel>
    </StoryContainer>
  </DemoBackground>
);
