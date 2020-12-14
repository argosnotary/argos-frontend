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
import CollapsibleContainerComponent from "./CollapsibleContainer";
import styled from "styled-components";
import FlexColumn from "./Flex";

export default {
  title: "Collapsible Container"
};

const Container = styled.div`
  width: 50%;
`;

export const example = () => (
  <Container>
    <FlexColumn>
      <p>Expanded by default: </p>
      <CollapsibleContainerComponent
        enabled={true}
        collapsedByDefault={false}
        title={`Title`}
        onCollapse={() => {
          alert("On collapse!");
        }}>
        Content
      </CollapsibleContainerComponent>
      <p>&nbsp;</p>
      <p>Collapsed by default: </p>
      <CollapsibleContainerComponent
        collapsedByDefault={true}
        enabled={true}
        title={`Title`}
        onCollapse={() => {
          alert("Click!");
        }}>
        Content
      </CollapsibleContainerComponent>
      <p>Shake on click: </p>
      <CollapsibleContainerComponent
        enabled={false}
        collapsedByDefault={true}
        title={`Title`}
        onCollapse={() => {
          alert("Click!");
        }}>
        Content
      </CollapsibleContainerComponent>
    </FlexColumn>
  </Container>
);
