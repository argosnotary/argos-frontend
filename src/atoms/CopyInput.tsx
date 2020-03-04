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
import React, { useRef, useContext, useState } from "react";
import styled, {
  ThemeContext,
  FlattenInterpolation,
  ThemeProps
} from "styled-components";
import ClipboardIcon from "./Icons/ClipboardIcon";
import { darken } from "polished";
import FlexRow from "./FlexRow";

interface IInputDisplayProps {
  inputCss: FlattenInterpolation<ThemeProps<any>>;
}
const Input = styled.input`
  position: absolute;
  left: -1000%;
`;

const InputDisplay = styled.p<IInputDisplayProps>`
  word-break: break-all;
  white-space: normal;
  ${props => props.inputCss}
`;

interface IClipboardWrapperProps {
  clipboardWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

const ClipboardWrapper = styled.button<IClipboardWrapperProps>`
  display: flex;
  background: transparent;
  border: 0;
  outline: 0;

  &:hover {
    cursor: pointer;
    background-color: ${props =>
      props.theme.passwordView.clipboardIcon.hoverBgColor};

    svg path {
      fill: ${props =>
        darken(0.1, props.theme.passwordView.clipboardIcon.color)};
    }
  }

  ${props => props.clipboardWrapperCss}
`;

const ModifiedFlexRow = styled(FlexRow)`
  align-items: center;
  justify-content: space-between;
`;

interface ICopyInputProps {
  value: string;
  inputCss: FlattenInterpolation<ThemeProps<any>>;
  clipboardWrapperCss: FlattenInterpolation<ThemeProps<any>>;
  clipboardIconSize: number;
}

const CopyInput: React.FC<ICopyInputProps> = ({
  value,
  inputCss,
  clipboardWrapperCss,
  clipboardIconSize
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useContext(ThemeContext);
  const [tempMessage, setTempMessage] = useState("");

  const copyInputToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      inputRef.current.setSelectionRange(0, 99999);
      const document: any = window.document || {};
      document.execCommand("copy");
      document.getSelection().removeAllRanges();

      setTempMessage("copied");

      setTimeout(() => {
        setTempMessage("");
      }, 1000);
    }
  };

  return (
    <>
      <Input
        readOnly={true}
        value={tempMessage.length > 0 ? tempMessage : value}
        ref={inputRef}
      />
      <ModifiedFlexRow disableWrap={true}>
        <InputDisplay inputCss={inputCss}>
          {tempMessage.length > 0 ? tempMessage : value}
        </InputDisplay>

        <ClipboardWrapper
          clipboardWrapperCss={clipboardWrapperCss}
          title="Copy value to clipboard"
          onClick={copyInputToClipboard}
        >
          <ClipboardIcon
            size={clipboardIconSize}
            color={theme.passwordView.clipboardIcon.color}
          />
        </ClipboardWrapper>
      </ModifiedFlexRow>
    </>
  );
};

export default CopyInput;
