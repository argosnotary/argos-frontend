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

import React, { ReactNode } from "react";
import styled from "styled-components";

import InputLabel from "../atoms/InputLabel";
import Select from "../atoms/Select";

interface IFormSelectProps {
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

const FormSelect: React.FC<IFormSelectProps> = ({
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
