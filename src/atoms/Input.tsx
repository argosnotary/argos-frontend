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
import styled, { css } from "styled-components";

export const InputCSS = css<{ disabled?: boolean; height?: string }>`
  overflow: visible;
  box-sizing: border-box;
  height: ${props => (props.height ? props.height : "2.4375rem")};
  margin: 0 0 1rem;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.input.borderColor};
  border-radius: 0;
  background-color: ${props =>
    props.disabled
      ? props.theme.input.disabledBgColor
      : props.theme.input.bgColor};
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  font-family: inherit;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.5;
  color: ${props => props.theme.input.textColor};
  transition: box-shadow 0.5s, border-color 0.25s ease-in-out,
    -webkit-box-shadow 0.5s;

  &:hover {
    cursor: ${props => (props.disabled ? "not-allowed" : "initial")};
  }

  &:focus {
    outline: none;
    border: 1px solid ${props => props.theme.input.focusBorderColor};
    box-shadow: 0 0 5px ${props => props.theme.input.focusBoxShadowColor};
  }
`;

const Input = styled.input`
  ${InputCSS}
`;

export default Input;
