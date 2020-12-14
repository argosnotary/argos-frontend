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

import Form from "react-bootstrap/Form";
import { Label } from "../../api";
import { Button } from "react-bootstrap";
import { FlexRow } from "../../atoms/Flex";
import styled from "styled-components";
import { darken } from "polished";

const ContentSeparator = styled.hr`
  padding: 0;
  margin: 0 0 1rem;
  border: 0;
`;

const StyledButton = styled(Button)`
  display: inline-block;
  vertical-align: middle;
  margin: 0 0 1rem 0;
  line-height: 1;
  padding: 0.8rem 1rem;
  border: 1px solid transparent;
  text-align: center;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: ${(props: any) =>
    props.disabled ? props.theme.button.disabledBgColor : props.theme.button.bgColor};
  color: ${(props: any) => props.theme.button.textColor};
  outline: 0;
  transition: background-color 0.25s ease-out, color 0.25s ease-out;

  &:hover {
    background-color: ${(props: any) =>
      props.disabled ? darken(0.1, props.theme.button.disabledBgColor) : darken(0.1, props.theme.button.bgColor)};
    cursor: ${(props: any) => (props.disabled ? "not-allowed" : "pointer")};
  }
`;

interface CancelButtonProps {
  noBorder?: boolean;
}

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin-left: 0;
`;

const CancelButton = styled(StyledButton)<CancelButtonProps>`
  background-color: ${props => props.theme.cancelButton.bgColor};
  color: ${props => props.theme.cancelButton.textColor};
  border: ${props => (props.noBorder ? "none" : `1px solid ${props.theme.cancelButton.borderColor}`)};

  &:hover {
    background-color: ${props => props.theme.cancelButton.hover.bgColor};
    color: ${props => props.theme.cancelButton.hover.textColor};
    border: 1px solid ${props => props.theme.cancelButton.hover.borderColor};
    cursor: pointer;
  }
`;

const CustomCancelButton = styled(CancelButton)`
  margin-left: 1rem;
`;

export interface LabelFormProps {
  label: Label;
  onSave: (e: any) => void;
  onChange: (e: any) => void;
  onCancel: (e: any) => void;
  disableSave: boolean;
  disabled: boolean;
}

export default function LabelForm(props: LabelFormProps): React.ReactElement {
  const { onSave, onChange, onCancel, disableSave, disabled, label } = props;

  return (
    <Form onSubmit={onSave}>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder={label.name}
          disabled={disabled}
          name="Name"
          value={label.name}
          onChange={onChange}
        />
        <Form.Label>Name</Form.Label>
      </Form.Group>
      <ContentSeparator />
      <FlexRow>
        <StyledButton type="submit" disabled={disableSave}>
          Save
        </StyledButton>
        <CustomCancelButton
          type="button"
          onClick={(e: any) => {
            onCancel(e);
          }}>
          Cancel
        </CustomCancelButton>
      </FlexRow>
    </Form>
  );
}
