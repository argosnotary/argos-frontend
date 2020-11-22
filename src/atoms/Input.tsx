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
