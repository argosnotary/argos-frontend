import React, { useRef, useContext, useState } from "react";
import styled, {
  ThemeContext,
  FlattenInterpolation,
  ThemeProps
} from "styled-components";
import ClipboardIcon from "./Icons/ClipboardIcon";
import { darken } from "polished";

interface IInputProps {
  inputCss: FlattenInterpolation<ThemeProps<any>>;
}
const Input = styled.input<IInputProps>`
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
        inputCss={inputCss}
        readOnly={true}
        value={tempMessage.length > 0 ? tempMessage : value}
        ref={inputRef}
      />
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
    </>
  );
};

export default CopyInput;
