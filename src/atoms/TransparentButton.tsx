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
import styled from "styled-components";

const TransparentButton = styled.button`
  display: flex;
  align-items: center;
  max-width: 11.5rem;
  font-size: 1rem;
  background-color: transparent;
  border: 1px solid
    ${props =>
      props.theme.transparentButton.default.transparentButtonBorderColor};
  color: ${props =>
    props.theme.transparentButton.default.transparentButtonTextColor};
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  display: flex;
  transition: background-color 0.25s ease-out, color 0.25s ease-out;

  &:hover {
    cursor: pointer;
    background-color: ${props =>
      props.theme.transparentButton.hover.transparentButtonBgColor};
    border: 1px solid
      ${props =>
        props.theme.transparentButton.hover.transparentButtonBorderColor};
    color: ${props =>
      props.theme.transparentButton.hover.transparentButtonTextColor};

    > svg > path {
      fill: #fff;
    }
  }

  > svg {
    max-width: 1.25rem;
    margin: 0 1rem 0 0;
  }
`;

export default TransparentButton;
