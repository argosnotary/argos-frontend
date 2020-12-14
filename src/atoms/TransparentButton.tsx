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
import styled from "styled-components";

const TransparentButton = styled.button`
  display: flex;
  align-items: center;
  min-height: 2.5rem;
  max-width: 11.5rem;
  font-size: 0.9rem;
  background-color: transparent;
  border: 1px solid
    ${props =>
      props.theme.transparentButton.default.transparentButtonBorderColor};
  color: ${props =>
    props.theme.transparentButton.default.transparentButtonTextColor};
  text-decoration: none;
  padding: 0 1rem 2px;
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
      fill: ${props => props.theme.transparentButton.iconColor};
    }
  }

  > svg {
    max-width: 1.25rem;
    margin: 0 1rem 0 0;
  }
`;

export default TransparentButton;
