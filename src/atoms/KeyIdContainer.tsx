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
import styled, { FlattenInterpolation, ThemeProps } from "styled-components";
import React from "react";
import CopyInput from "./CopyInput";

interface IKeyId {
  keyId: string;
  clipboardIconSize: number;
  inputCss: FlattenInterpolation<ThemeProps<any>>;
  clipboardWrapperCss: FlattenInterpolation<ThemeProps<any>>;
  copyInputWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

interface ICopyInputProps{
    copyInputWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

const KeyIdLabel = styled.span`
  font-size: 0.875rem;
`;

const CopyInputWrapper = styled.div<ICopyInputProps>`
  ${props => props.copyInputWrapperCss}
`;

const KeyIdContainer: React.FC<IKeyId> = ({
  keyId,
  inputCss,
  clipboardIconSize,
  clipboardWrapperCss,
    copyInputWrapperCss
}) => (
  <>
    <KeyIdLabel>Key id</KeyIdLabel>
    <CopyInputWrapper copyInputWrapperCss={copyInputWrapperCss}>
      <CopyInput
        value={keyId}
        clipboardIconSize={clipboardIconSize}
        inputCss={inputCss}
        clipboardWrapperCss={clipboardWrapperCss}
      />
    </CopyInputWrapper>
  </>
);

export default KeyIdContainer;
