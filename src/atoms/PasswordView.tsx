import React, { useContext, useRef } from "react";
import styled, { ThemeContext } from "styled-components";

import FlexColumn from "../atoms/FlexColumn";
import FlexRow from "../atoms/FlexRow";
import { KeyIcon } from "../atoms/Icons";

const PasswordBody = styled.section`
  background: #fff;
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.keyManagementPage.passwordColor};
  margin: 1rem 0;
  padding: 1.25rem 1.5rem;
  width: 100%;
`;

const PasswordCopy = styled.p`
  color: ${props => props.theme.keyManagementPage.passwordColor};
`;

const Password = styled.input`
  margin: 0.75rem 1rem;
  color: ${props => props.theme.keyManagementPage.passwordColor};
  font-size: 2rem;
  border: none;
  outline: none;
  max-width: 20rem;
`;

const PasswordContainer = styled(FlexRow)`
  margin: 1rem 0;
  align-items: center;
`;

const PasswordIconWrapper = styled.div`
  position: relative;
  top: 3px;
  margin: 0 0 0 1rem;
`;

interface IPasswordViewProps {
  password: string;
}

const PasswordView: React.FC<IPasswordViewProps> = ({ password }) => {
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const theme = useContext(ThemeContext);

  return (
    <PasswordBody>
      <FlexColumn>
        <PasswordCopy>
          Your key has been generated with the following passphrase:
        </PasswordCopy>
        <PasswordContainer>
          <PasswordIconWrapper>
            <KeyIcon color={theme.keyManagementPage.passwordColor} size={40} />
          </PasswordIconWrapper>
          <Password readOnly={true} value={password} ref={passwordInputRef} />
        </PasswordContainer>
        <PasswordCopy>
          Do not forget to copy your passphrase before closing this window.
        </PasswordCopy>
      </FlexColumn>
    </PasswordBody>
  );
};

export default PasswordView;
