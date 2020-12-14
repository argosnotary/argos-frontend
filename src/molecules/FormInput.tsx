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
import styled from "styled-components";

import Input from "../atoms/Input";
import InputLabel from "../atoms/InputLabel";

interface FormInputProps {
  dataTesthookId?: string;
  labelValue?: string;
  placeHolder?: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formType: string;
  disabled?: boolean;
  innerRef?: React.RefObject<HTMLInputElement>;
}

const FormInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function FormInput(props: FormInputProps): React.ReactElement {
  const {
    dataTesthookId,
    labelValue,
    placeHolder,
    value,
    onBlur,
    onChange,
    name,
    formType,
    defaultValue,
    disabled,
    innerRef
  } = props;
  return (
    <FormInputContainer>
      {labelValue ? <InputLabel>{labelValue}</InputLabel> : null}
      <Input
        data-testhook-id={dataTesthookId}
        disabled={disabled}
        name={name}
        {...(onBlur ? { onBlur } : "")}
        {...(onChange ? { onChange } : "")}
        value={value}
        defaultValue={defaultValue}
        {...(placeHolder ? { placeholder: placeHolder } : "")}
        type={formType}
        ref={innerRef}
      />
    </FormInputContainer>
  );
}
