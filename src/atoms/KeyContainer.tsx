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
import styled, { FlattenInterpolation, ThemeProps } from "styled-components";
import React from "react";
import CopyInput from "./CopyInput";
import { IPublicKey } from "../interfaces/IPublicKey";

interface IKeyDisplay {
  publicKey: IPublicKey;
  clipboardIconSize: number;
  inputCss: FlattenInterpolation<ThemeProps<any>>;
  clipboardWrapperCss: FlattenInterpolation<ThemeProps<any>>;
  copyInputWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

interface ICopyInputProps {
  copyInputWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

const KeyContainerLabel = styled.p`
  font-weight: bold;
  font-size: 0.875rem;
`;

const CopyInputWrapper = styled.div<ICopyInputProps>`
  ${props => props.copyInputWrapperCss}
`;

const KeyContainer: React.FC<IKeyDisplay> = ({
  publicKey,
  inputCss,
  clipboardIconSize,
  clipboardWrapperCss,
  copyInputWrapperCss
}) => (
  <>
    <KeyContainerLabel>Key id</KeyContainerLabel>
    <CopyInputWrapper copyInputWrapperCss={copyInputWrapperCss}>
      <CopyInput
        value={publicKey ? publicKey.keyId : ""}
        clipboardIconSize={clipboardIconSize}
        inputCss={inputCss}
        clipboardWrapperCss={clipboardWrapperCss}
      />
      <KeyContainerLabel>Public key</KeyContainerLabel>
      <CopyInput
        value={publicKey ? publicKey.publicKey : ""}
        clipboardIconSize={clipboardIconSize}
        inputCss={inputCss}
        clipboardWrapperCss={clipboardWrapperCss}
      />
    </CopyInputWrapper>
  </>
);

export default KeyContainer;
