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
import styled, { ThemeContext, css } from "styled-components";

import { FlexColumn, FlexRow } from "../atoms/Flex";
import { KeyIcon } from "../atoms/Icons";
import CopyInput from "./CopyInput";

const inputCss = css`
  margin: 0.75rem 1rem;
  color: ${props => props.theme.keyManagementPage.passwordColor};
  font-size: 1.6rem;
  border: none;
  outline: none;
  max-width: 14rem;
  text-align: center;
`;

const clipboardWrapperCss = css`
  padding: 0.4rem 0.5rem 0.3rem;
`;

interface PasswordBody {
  margin?: string;
}

const PasswordBody = styled.section<PasswordBody>`
  background: ${props => props.theme.keyManagementPage.passwordBgColor};
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.keyManagementPage.passwordColor};
  margin: ${props => (props.margin ? props.margin : "1rem 0")};
  padding: 1.25rem 1.5rem;
  width: 100%;
`;

const PasswordCopy = styled.p`
  color: ${props => props.theme.keyManagementPage.passwordColor};
`;

const PasswordContainer = styled(FlexRow)`
  margin: 1rem 0;
  align-items: center;
`;

const PasswordIconWrapper = styled.div`
  position: relative;
  top: 3px;
  margin: 0.4rem 0.5rem 0.3rem;
`;

const FlexRowCenteredContent = styled(FlexRow)`
  justify-content: center;
`;

interface PasswordViewProps {
  password: string;
  margin?: string;
}

export default function PasswordView(props: PasswordViewProps): React.ReactElement {
  const { password, margin } = props;
  const theme = useContext(ThemeContext);

  return (
    <PasswordBody margin={margin}>
      <FlexColumn>
        <PasswordCopy>Key has been generated with the following passphrase:</PasswordCopy>
        <FlexRowCenteredContent>
          <PasswordContainer>
            <PasswordIconWrapper>
              <KeyIcon color={theme.keyManagementPage.passwordColor} size={32} />
            </PasswordIconWrapper>
            <CopyInput
              value={password}
              inputCss={inputCss}
              clipboardWrapperCss={clipboardWrapperCss}
              clipboardIconSize={24}
            />
          </PasswordContainer>
        </FlexRowCenteredContent>
        <PasswordCopy>Do not forget to copy the passphrase before closing this message.</PasswordCopy>
      </FlexColumn>
    </PasswordBody>
  );
}
