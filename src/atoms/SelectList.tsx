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
import React, { ReactNode, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import ChevronIcon from "./Icons/ChevronIcon";

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;

const HoverArrow = styled.div`
  display: none;

  svg {
    margin-right: 0.5rem;
    transform: rotate(-90deg);
  }
`;

const Label = styled.label`
  display: flex;
  background-color: ${props => props.theme.selectList.defaultItemBgColor};
  margin: 0.5rem 0;
  align-items: center;
  padding: 0.5rem 1rem 0.5rem 0.5rem;

  &:first-of-type {
    margin: 0 0 0.5rem;
  }

  &:hover {
    cursor: pointer;

    ${HoverArrow} {
      display: flex;
    }
  }
`;

const Input = styled.input`
  display: none;

  &:checked + ${Label} {
    background-color: ${props => props.theme.selectList.selectedItemBgColor};

    ${HoverArrow} {
      display: flex;
    }
  }
`;

interface ISelectListItemProps {
  fieldName: string;
  fieldValue: string;
  children: ReactNode;
  onSelect?: () => void;
  checked?: boolean;
}

export const SelectListItem: React.FC<ISelectListItemProps> = props => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <Input
        type="radio"
        id={`id-${props.fieldValue}`}
        name={props.fieldName}
        value={props.fieldValue}
        {...(props.checked ? { checked: props.checked } : "")}
      />
      <Label htmlFor={`id-${props.fieldValue}`} onClick={props.onSelect}>
        <HoverArrow>
          <ChevronIcon size={14} color={theme.selectList.iconColor} />
        </HoverArrow>
        <span>{props.children}</span>
      </Label>
    </>
  );
};

interface ISelectListProps {
  children: ReactNode;
}

export const SelectList: React.FC<ISelectListProps> = props => {
  return <Container>{props.children}</Container>;
};

export default SelectList;
