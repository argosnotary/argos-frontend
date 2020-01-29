/*
 * Copyright (C) 2019 - 2020 Rabobank Nederland
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
import styled, { css } from "styled-components";

const BaseButtonStyle = css`
  margin: 0 0 1rem 0;
  padding: 0.85rem 1rem;
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
`;

const AnchorButton = styled.a`
  ${BaseButtonStyle}
`;

export { AnchorButton, Button };
