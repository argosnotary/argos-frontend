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
  align-items: center;
  padding: 0.5rem 1rem 0.5rem 0.5rem;

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
  labelValue: string;
  onSelect?: () => void;
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
      />
      <Label htmlFor={`id-${props.fieldValue}`} onClick={props.onSelect}>
        <HoverArrow>
          <ChevronIcon size={14} color={theme.selectList.iconColor} />
        </HoverArrow>
        <span>{props.labelValue}</span>
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
