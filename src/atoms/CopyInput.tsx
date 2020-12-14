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
import React, { useRef, useContext, useState } from "react";
import styled, {
  ThemeContext,
  FlattenInterpolation,
  ThemeProps
} from "styled-components";
import ClipboardIcon from "./Icons/ClipboardIcon";
import { darken } from "polished";
import {FlexRow} from "./Flex";

interface InputDisplayProps {
  inputCss: FlattenInterpolation<ThemeProps<any>>;
}
const Input = styled.input`
  position: absolute;
  left: -1000%;
`;

const InputDisplay = styled.p<InputDisplayProps>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  background: ${props => props.theme.copyInput.bgColor};
  padding: 0 0.2rem;
  border-radius: 0.1rem;
  ${props => props.inputCss}
`;

interface ClipboardWrapperProps {
  clipboardWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

const ClipboardWrapper = styled.button<ClipboardWrapperProps>`
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
  justify-content: flex-start;
`;

interface CopyInputProps {
  value: string;
  inputCss: FlattenInterpolation<ThemeProps<any>>;
  clipboardWrapperCss: FlattenInterpolation<ThemeProps<any>>;
  clipboardIconSize: number;
}

const CopyInput: React.FC<CopyInputProps> = ({
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

  const getInputValue = (): string => {
    if (tempMessage.length > 0) {
      return tempMessage;
    }

    if (value) {
      return value;
    }

    return "";
  };

  return (
    <>
      <Input readOnly={true} value={getInputValue()} ref={inputRef} />
      <ModifiedFlexRow disableWrap={true}>
        <InputDisplay inputCss={inputCss}>{getInputValue()}</InputDisplay>

        <ClipboardWrapper
          clipboardWrapperCss={clipboardWrapperCss}
          title="Copy value to clipboard"
          onClick={copyInputToClipboard}>
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
