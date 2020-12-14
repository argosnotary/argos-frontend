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
