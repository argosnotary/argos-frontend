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

interface TreeHeadLabelSpanProps {
  selected: boolean;
}

export const TreeHeadLabelSpan = styled.span<TreeHeadLabelSpanProps>`
  user-select: none;
  cursor: pointer;
  padding: 0.1rem 0.4rem;
  border: 1px solid transparent;
  background-color: ${props => (props.selected ? props.theme.treeEditor.treeHeadLabel.bgColor : "transparent")};

  &:hover {
    background-color: ${props => props.theme.treeEditor.treeHeadLabel.bgColor};
    border-radius: 2px;
  }
`;
