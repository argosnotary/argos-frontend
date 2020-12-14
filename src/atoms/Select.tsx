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

export const SelectCSS = css<{ disabled?: boolean; height?: string }>`
  &::-ms-expand {
    display: none;
  }

  margin: 0 0 1rem;
  display: flex;
  box-sizing: border-box;
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border: 1px solid ${props => props.theme.input.borderColor};
  border-radius: 0;
  font: inherit;
  line-height: inherit;
  appearance: none;
  background-repeat: no-repeat;
  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position: right 15px top 1em, right 10px top 1em;
  background-size: 5px 5px, 5px 5px;

  background-color: ${props =>
    props.disabled
      ? props.theme.input.disabledBgColor
      : props.theme.input.bgColor};
  &:hover {
    cursor: ${props => (props.disabled ? "not-allowed" : "initial")};
  }

  &:focus {
    outline: none;
    border: 1px solid ${props => props.theme.input.focusBorderColor};
    box-shadow: 0 0 5px ${props => props.theme.input.focusBoxShadowColor};
  }
`;

const Select = styled.select`
  ${SelectCSS}
`;

export const SelectionContainer = styled.section`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 1rem;

  ${Select} {
    margin: 0 0 0 1rem;
  }

  background-color: ${props =>
    props.theme.ruleEditor.selectionContainer.bgColor};
`;

export default Select;
