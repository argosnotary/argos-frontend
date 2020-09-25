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
