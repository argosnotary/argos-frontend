/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
import { darken } from "polished";
import React, { useContext } from "react";
import styled, { css, ThemeContext } from "styled-components";

import { LoaderIcon } from "../atoms/Icons";

const BaseButtonStyle = css`
  display: inline-block;
  vertical-align: middle;
  margin: 0 0 1rem 0;
  line-height: 1;
  padding: 0.8rem 1rem;
  border: 1px solid transparent;
  text-align: center;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: ${props => props.theme.button.bgColor};
  color: ${props => props.theme.button.textColor};
  outline: 0;
  transition: background-color 0.25s ease-out, color 0.25s ease-out;

  &:hover {
    background-color: ${props => darken(0.1, props.theme.button.bgColor)};
    cursor: pointer;
  }
`;

const Button = styled.button`
  ${BaseButtonStyle}

  background-color: ${props =>
    props.disabled
      ? props.theme.button.disabledBgColor
      : props.theme.button.bgColor};

  &:hover {
    background-color: ${props =>
      props.disabled
        ? darken(0.1, props.theme.button.disabledBgColor)
        : darken(0.1, props.theme.button.bgColor)};
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")}
  }
`;

const AnchorButton = styled.a`
  ${BaseButtonStyle}
`;

interface ILoaderButtonProps {
  children: string;
  loading: boolean;
  buttonType: "button" | "submit" | "reset";
  onClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  onMouseDown?: () => void;
  dataTesthookId?: string;
}

const LoaderIconButton = styled(Button)`
  padding: 0.58rem 1rem;
`;

const LoaderButton: React.FC<ILoaderButtonProps> = ({
  children,
  loading,
  buttonType,
  onClick,
  disabled,
  onMouseDown,
  dataTesthookId
}) => {
  const theme = useContext(ThemeContext);

  if (loading) {
    return (
      <LoaderIconButton type={buttonType}>
        <LoaderIcon size={18} color={theme.loaderButton.loadingColor} />
      </LoaderIconButton>
    );
  }
  return (
    <Button
      data-testhook-id={dataTesthookId}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={onMouseDown}
      type={buttonType}>
      {children}
    </Button>
  );
};

interface ICancelButtonProps {
  noBorder?: boolean;
}

const CancelButton = styled(Button)<ICancelButtonProps>`
  background-color: ${props => props.theme.cancelButton.bgColor};
  color: ${props => props.theme.cancelButton.textColor};
  border: ${props =>
    props.noBorder
      ? "none"
      : `1px solid ${props.theme.cancelButton.borderColor}`};

  &:hover {
    background-color: ${props => props.theme.cancelButton.hover.bgColor};
    color: ${props => props.theme.cancelButton.hover.textColor};
    border: 1px solid ${props => props.theme.cancelButton.hover.borderColor};
    cursor: pointer;
  }
`;

export { AnchorButton, CancelButton, Button, LoaderButton };
