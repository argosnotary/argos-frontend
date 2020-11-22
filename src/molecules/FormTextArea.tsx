/*
 * Copyright (C) 2020 Argos Notary
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
  dataTesthookId?: string;
  labelValue?: string;
  placeHolder?: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onBlur?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  formType: string;
  disabled?: boolean;
  height?: string;
  innerRef?: React.RefObject<HTMLTextAreaElement>;
}

const FormTextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormInput: React.FC<IFormTextAreaProps> = ({
  dataTesthookId,
  labelValue,
  placeHolder,
  value,
  onBlur,
  onChange,
  name,
  defaultValue,
  disabled,
  height,
  innerRef
}) => (
  <FormTextAreaContainer>
    {labelValue ? <InputLabel>{labelValue}</InputLabel> : null}
    <TextArea
      data-testhook-id={dataTesthookId}
      height={height}
      disabled={disabled}
      name={name}
      {...(onBlur ? { onBlur } : "")}
      {...(onChange ? { onChange } : "")}
      value={value}
      defaultValue={defaultValue}
      {...(placeHolder ? { placeholder: placeHolder } : "")}
      ref={innerRef}
    />
  </FormTextAreaContainer>
);

export default FormInput;
