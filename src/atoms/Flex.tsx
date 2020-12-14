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
import { generateMediaQuery } from "../util/mediaQuery";

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

interface FlexRowProps {
  disableWrap?: boolean;
}

export const FlexRow = styled.div<FlexRowProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: ${props => (props.disableWrap ? "nowrap" : "wrap")};
`;

export const FlexRowContainer = styled(FlexRow)`
  max-width: 20rem;
  ${generateMediaQuery(
    "max-width",
    "md",
    `
    max-width: 100%;    `
  )};
`;

export const FlexColumnContainer = styled(FlexColumn)`
  width: 100%;
`;
