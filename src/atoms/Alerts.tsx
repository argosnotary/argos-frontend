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

const Warning: React.FC<AlertProps> = ({ message }) => {
  const theme = useContext(ThemeContext);

  return (
    <WarningContainer>
      <IconWrapper>
        <WarningIcon size={48} color={theme.alerts.warning.color} />
      </IconWrapper>
      <WarningMessage>{message}</WarningMessage>
    </WarningContainer>
  );
};

export { Warning };
