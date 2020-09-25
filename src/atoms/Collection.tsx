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
import styled, { css } from "styled-components";
import Input from "./Input";
import InputErrorLabel from "./InputErrorLabel";

interface ICollectionContainerProps {
  inverted?: boolean;
}

export const CollectionContainer = styled.section<ICollectionContainerProps>`
  margin: 2rem 0;
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
  padding: 0 1rem 1rem;
  border: 1px solid ${props => props.theme.collection.borderColor};

  background: ${props =>
    props.inverted ? props.theme.collection.invertedBgColor : "transparent"};

  li ~ li {
    margin-top: 1rem;
  }

  li ~ section {
    margin-top: 1rem;
  }
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
    svg {
      cursor: pointer;
      transform: scale(0.8);
    }
  }
`;

interface ICollectionContainerButtonProps {
  inverted?: boolean;
}

const CollectionContainerButtonInvertedCSS = css`
  border: 1px solid ${props => props.theme.collection.buttonInvertedBorderColor};
  background-color: ${props => props.theme.collection.buttonInvertedBgColor};
  padding: 0 0.65rem;

  svg {
    position: relative;
    top: 2px;
  }

  &:hover {
    cursor: pointer;
    transform: scale(0.9);
    svg {
      top: 1px;
    }
  }
`;

export const CollectionContainerButton = styled.button<
  ICollectionContainerButtonProps
>`
  position: relative;
  top: -1rem;
  border: 0;
  right: 0;

  &:hover {
    cursor: pointer;
    transform: scale(0.8);
  }

  ${props => (props.inverted ? CollectionContainerButtonInvertedCSS : "")}
`;

export const CollectionContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const CollectionContainerTitle = styled.header`
  position: relative;
  display: inline-flex;
  font-size: 0.9rem;
  top: -1rem;
  color: ${props => props.theme.collection.titleTextColor};
  background-color: ${props => props.theme.collection.titleBgColor};
  padding: 0.25rem 2rem 0.4rem;
`;

export const CollectionContainerTitleSmall = styled.header`
  position: relative;
  font-size: 0.9rem;
  top: -0.75rem;
  background-color: ${props => props.theme.collection.smallTitleBgColor};
  display: inline-flex;
  top: -1rem;
  margin: 0 auto;
  padding: 0.25rem 1rem;
  border: 1px solid ${props => props.theme.collection.smallTitleBorderColor};
`;

export const CollectionContainerList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const CollectionContainerSpan = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface ICollectionContainerCardProps {
  active?: boolean;
  clickable: boolean;
}

export const CollectionContainerCard = styled.header<
  ICollectionContainerCardProps
>`
  border: 1px solid
    ${props =>
      props.active
        ? props.theme.collection.cardActiveBorderColor
        : "transparent"};
  font-size: 1rem;
  padding: 0.5rem;
  width: 100%;
  background-color: ${props => props.theme.collection.cardBgColor};
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    margin: 0 0.5rem;
  }

  ${Input} {
    margin: 0;
  }

  ${InputErrorLabel} {
    margin: 0.5rem 0 0;
  }

  &:hover {
    ${props => (props.clickable ? "cursor: pointer" : "")};
    border: 1px solid ${props => props.theme.collection.cardHoverBorderColor};
  }
`;
