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
import styled, { FlattenInterpolation, ThemeProps } from "styled-components";
import React from "react";
import CopyInput from "../../atoms/CopyInput";

interface KeyContainerProps {
  theKey: any;
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

function KeyContainer(props: KeyContainerProps): React.ReactElement {
  const { theKey, clipboardIconSize, inputCss, clipboardWrapperCss, copyInputWrapperCss } = props;
  return (
    <>
      <KeyContainerLabel>Key id</KeyContainerLabel>
      <CopyInputWrapper copyInputWrapperCss={copyInputWrapperCss}>
        <CopyInput
          value={theKey.keyId}
          clipboardIconSize={clipboardIconSize}
          inputCss={inputCss}
          clipboardWrapperCss={clipboardWrapperCss}
        />
        <KeyContainerLabel>Public key</KeyContainerLabel>
        <CopyInput
          value={theKey.publicKey}
          clipboardIconSize={clipboardIconSize}
          inputCss={inputCss}
          clipboardWrapperCss={clipboardWrapperCss}
        />
      </CopyInputWrapper>
    </>
  );
}

export default KeyContainer;
