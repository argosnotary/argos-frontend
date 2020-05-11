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
import styled from "styled-components";

export const LayoutItemContainer = styled.li`
  margin: 1rem 0 1rem;
  border: 1px solid #1779ba;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 18.8rem;
`;

export const ActionIconsContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const BaseActionButton = styled.button`
  display: inline-flex;
  background: none;
  border: 0;

  &:hover {
    cursor: pointer;
    transform: scale(0.8);
  }
`;

export const LayoutItemContainerButton = styled.button`
  position: relative;
  top: -1rem;
  background-color: #f1f1f1;
  border: 0;
`;

export const LayoutItemContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const LayoutItemContainerTitle = styled.header`
  position: relative;
  font-size: 0.9rem;
  top: -0.75rem;
  background-color: #f1f1f1;
  display: inline-flex;
`;

export const LayoutItemContainerList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
