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

interface SelectListItemProps {
  fieldName: string;
  fieldValue: string;
  children: ReactNode;
  onSelect?: () => void;
  checked?: boolean;
}

export const SelectListItem: React.FC<SelectListItemProps> = props => {
  const theme = useContext(ThemeContext);

  return (
    <>
      <Input
        type="radio"
        id={`id-${props.fieldValue}`}
        name={props.fieldName}
        value={props.fieldValue || ""}
        checked={props.checked}
        onChange={() => {
          return;
        }}
      />
      <Label
        data-testhook-id={`select-list-item-${props.fieldValue}`}
        htmlFor={`id-${props.fieldValue}`}
        onClick={props.onSelect}>
        <HoverArrow>
          <ChevronIcon size={14} color={theme.selectList.iconColor} />
        </HoverArrow>
        <span>{props.children}</span>
      </Label>
    </>
  );
};

interface SelectListProps {
  children: ReactNode;
}

export const SelectList: React.FC<SelectListProps> = props => {
  return <Container>{props.children}</Container>;
};

export default SelectList;
