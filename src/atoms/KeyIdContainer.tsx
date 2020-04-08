import styled, { FlattenInterpolation, ThemeProps } from "styled-components";
import React from "react";
import CopyInput from "./CopyInput";

interface IKeyId {
  keyId: string;
  clipboardIconSize: number;
  inputCss: FlattenInterpolation<ThemeProps<any>>;
  clipboardWrapperCss: FlattenInterpolation<ThemeProps<any>>;
}

const KeyIdLabel = styled.span`
  font-size: 0.875rem;
`;

const CopyInputWrapper = styled.div`
  margin: 0 0 1rem;
`;

const KeyIdContainer: React.FC<IKeyId> = ({
  keyId,
  inputCss,
  clipboardIconSize,
  clipboardWrapperCss
}) => (
  <>
    <KeyIdLabel>Key id</KeyIdLabel>
    <CopyInputWrapper>
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
