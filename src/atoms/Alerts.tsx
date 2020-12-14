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
import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";

import { WarningIcon } from "./Icons";

interface AlertProps {
  message: string;
}

export const WarningContainer = styled.section`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.alerts.warning.color};
  margin: 1rem 0;
  padding: 1rem;
  width: 100%;
`;

const WarningMessage = styled.p`
  color: ${props => props.theme.alerts.warning.color};
`;

const IconWrapper = styled.div`
  margin: 0 2rem 0 0;
`;

export function Warning(props: AlertProps): React.ReactElement {
  const { message } = props;
  const theme = useContext(ThemeContext);

  return (
    <WarningContainer>
      <IconWrapper>
        <WarningIcon size={48} color={theme.alerts.warning.color} />
      </IconWrapper>
      <WarningMessage>{message}</WarningMessage>
    </WarningContainer>
  );
}
