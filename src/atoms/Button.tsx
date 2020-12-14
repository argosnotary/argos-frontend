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
import { darken } from "polished";
import React, { useContext } from "react";
import styled, { css, ThemeContext } from "styled-components";

import { LoaderIcon } from "./Icons";

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

  background-color: ${props => (props.disabled ? props.theme.button.disabledBgColor : props.theme.button.bgColor)};

  &:hover {
    background-color: ${props =>
      props.disabled ? darken(0.1, props.theme.button.disabledBgColor) : darken(0.1, props.theme.button.bgColor)};
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  }
`;

const AnchorButton = styled.a`
  ${BaseButtonStyle}

  display: flex;
  justify-content: left;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  font-size: 1rem;
  text-decoration: none;
  background: transparent;
  min-height: 3.25rem;
  &:hover {
    background: transparent;
  }
`;

interface LoaderButtonProps {
  children: string;
  loading: boolean;
  buttonType: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  onMouseDown?: () => void;
  dataTesthookId?: string;
}

const LoaderIconButton = styled(Button)`
  padding: 0.58rem 1rem;
`;

const LoaderButton: React.FC<LoaderButtonProps> = (props: LoaderButtonProps) => {
  const theme = useContext(ThemeContext);

  if (props.loading) {
    return (
      <LoaderIconButton type={props.buttonType}>
        <LoaderIcon size={18} color={theme.loaderButton.loadingColor} />{" "}
      </LoaderIconButton>
    );
  }
  return (
    <Button
      data-testhook-id={props.dataTesthookId}
      disabled={props.disabled}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      type={props.buttonType}>
      {props.children}
    </Button>
  );
};

interface CancelButtonProps {
  noBorder?: boolean;
}

const CancelButton = styled(Button)<CancelButtonProps>`
  background-color: ${props => props.theme.cancelButton.bgColor};
  color: ${props => props.theme.cancelButton.textColor};
  border: ${props => (props.noBorder ? "none" : `1px solid ${props.theme.cancelButton.borderColor}`)};

  &:hover {
    background-color: ${props => props.theme.cancelButton.hover.bgColor};
    color: ${props => props.theme.cancelButton.hover.textColor};
    border: 1px solid ${props => props.theme.cancelButton.hover.borderColor};
    cursor: pointer;
  }
`;

export { AnchorButton, CancelButton, Button, LoaderButton };
