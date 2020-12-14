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
import React, { ReactNode } from "react";
import styled from "styled-components";

import InputLabel from "../atoms/InputLabel";
import Select from "../atoms/Select";

interface FormSelectProps {
  dataTesthookId?: string;
  labelValue?: string;
  placeHolder?: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onBlur?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  formType: string;
  disabled?: boolean;
  innerRef?: React.RefObject<HTMLSelectElement>;
  children: ReactNode;
}

const FormSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormSelect: React.FC<FormSelectProps> = ({
  dataTesthookId,
  labelValue,
  placeHolder,
  value,
  onBlur,
  onChange,
  name,
  defaultValue,
  disabled,
  innerRef,
  children
}) => (
  <FormSelectContainer>
    {labelValue ? <InputLabel>{labelValue}</InputLabel> : null}
    <Select
      data-testhook-id={dataTesthookId}
      disabled={disabled}
      name={name}
      {...(onBlur ? { onBlur } : "")}
      {...(onChange ? { onChange } : "")}
      value={value}
      defaultValue={defaultValue}
      {...(placeHolder ? { placeholder: placeHolder } : "")}
      ref={innerRef}>
      {children}
    </Select>
  </FormSelectContainer>
);

export default FormSelect;
