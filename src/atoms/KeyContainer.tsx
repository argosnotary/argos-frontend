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
import { connect } from "react-redux";
import CopyInput from "./CopyInput";
import { PublicKey } from "../api";
import { Key } from "../util/security";

interface KeyDisplay {
  publicKey: any;
  clipboardIconSize: number;
  inputCss: FlattenInterpolation<ThemeProps<any>>;
  clipboardWrapperCss: FlattenInterpolation<ThemeProps<any>>;
  copyInputWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

interface CopyInputProps {
  copyInputWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

const KeyContainerLabel = styled.p`
  font-weight: bold;
  font-size: 0.875rem;
`;

const CopyInputWrapper = styled.div<CopyInputProps>`
  ${props => props.copyInputWrapperCss}
`;

function KeyContainer(props: any) {
  const { publicKey, clipboardIconSize, inputCss, clipboardWrapperCss, copyInputWrapperCss } = props;
  return (
    <>
      <KeyContainerLabel>Key id</KeyContainerLabel>
      <CopyInputWrapper copyInputWrapperCss={copyInputWrapperCss}>
        <CopyInput
          value={publicKey && publicKey.keyId ? publicKey.keyId : ""}
          clipboardIconSize={clipboardIconSize}
          inputCss={inputCss}
          clipboardWrapperCss={clipboardWrapperCss}
        />
        <KeyContainerLabel>Public key</KeyContainerLabel>
        <CopyInput
          value={publicKey && publicKey.publicKey ? publicKey.publicKey : ""}
          clipboardIconSize={clipboardIconSize}
          inputCss={inputCss}
          clipboardWrapperCss={clipboardWrapperCss}
        />
      </CopyInputWrapper>
    </>
  );
}

function mapStateToProps(state: any) {
  return {
    publicKey: state.key.key
  };
}

export default connect(mapStateToProps)(KeyContainer);
