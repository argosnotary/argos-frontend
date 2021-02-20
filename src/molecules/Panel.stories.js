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
