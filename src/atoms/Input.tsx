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

import styled, { css } from "styled-components";

export const InputCSS = css<{ disabled: boolean | undefined }>`
  overflow: visible;
  box-sizing: border-box;
  height: 2.4375rem;
  margin: 0 0 1rem;
  padding: 0.5rem;
  border: 1px solid #cacaca;
  border-radius: 0;
  background-color: ${(props) => (props.disabled ? "#e0e0e0" : "#fefefe")};
  box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
  font-family: inherit;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.5;
  color: #0a0a0a;
  transition: box-shadow 0.5s, border-color 0.25s ease-in-out,
    -webkit-box-shadow 0.5s;

  &:hover {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "initial")};
  }

  &:focus {
    outline: none;
    border: 1px solid #8a8a8a;
    box-shadow: 0 0 5px #cacaca;
  }
`;

const Input = styled.input`
  ${InputCSS}
`;

export default Input;
