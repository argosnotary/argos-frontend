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

import React from "react";
import styled from "styled-components";

import Input from "../atoms/Input";
import InputLabel from "../atoms/InputLabel";

interface IFormInputProps {
  labelValue?: string;
  placeHolder?: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formType: string;
  disabled?: boolean;
}

const FormInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormInput: React.FC<IFormInputProps> = ({
  labelValue,
  placeHolder,
  value,
  onBlur,
  onChange,
  name,
  formType,
  defaultValue,
  disabled
}) => (
  <FormInputContainer>
    {labelValue ? <InputLabel>{labelValue}</InputLabel> : null}
    <Input
      disabled={disabled}
      name={name}
      {...(onBlur ? { onBlur } : "")}
      {...(onChange ? { onChange } : "")}
      value={value}
      defaultValue={defaultValue}
      {...(placeHolder ? { placeholder: placeHolder } : "")}
      type={formType}
    />
  </FormInputContainer>
);

export default FormInput;
