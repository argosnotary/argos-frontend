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

import InputLabel from "../atoms/InputLabel";
import TextArea from "../atoms/TextArea";

interface IFormTextAreaProps {
  labelValue: string;
  placeHolder?: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onBlur?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInput?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  formType: string;
  disabled?: boolean;
  height?: string;
}

const FormTextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormInput: React.FC<IFormTextAreaProps> = ({
  labelValue,
  placeHolder,
  value,
  onBlur,
  onInput,
  name,
  defaultValue,
  disabled,
  height
}) => (
  <FormTextAreaContainer>
    <InputLabel>{labelValue}</InputLabel>
    <TextArea
      height={height}
      disabled={disabled}
      name={name}
      {...(onBlur ? { onBlur } : "")}
      {...(onInput ? { onInput } : "")}
      value={value}
      defaultValue={defaultValue}
      {...(placeHolder ? { placeholder: placeHolder } : "")}
    />
  </FormTextAreaContainer>
);

export default FormInput;
