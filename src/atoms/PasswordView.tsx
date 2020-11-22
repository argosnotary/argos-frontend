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
import styled, { ThemeContext, css } from "styled-components";

import FlexColumn from "../atoms/FlexColumn";
import FlexRow from "../atoms/FlexRow";
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

interface IPasswordBody {
  margin?: string;
}

const PasswordBody = styled.section<IPasswordBody>`
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

interface IPasswordViewProps {
  password: string;
  margin?: string;
}

const PasswordView: React.FC<IPasswordViewProps> = ({ password, margin }) => {
  const theme = useContext(ThemeContext);

  return (
    <PasswordBody margin={margin}>
      <FlexColumn>
        <PasswordCopy>
          Key has been generated with the following passphrase:
        </PasswordCopy>
        <FlexRowCenteredContent>
          <PasswordContainer>
            <PasswordIconWrapper>
              <KeyIcon
                color={theme.keyManagementPage.passwordColor}
                size={32}
              />
            </PasswordIconWrapper>
            <CopyInput
              value={password}
              inputCss={inputCss}
              clipboardWrapperCss={clipboardWrapperCss}
              clipboardIconSize={24}
            />
          </PasswordContainer>
        </FlexRowCenteredContent>
        <PasswordCopy>
          Do not forget to copy the passphrase before closing this message.
        </PasswordCopy>
      </FlexColumn>
    </PasswordBody>
  );
};

export default PasswordView;
