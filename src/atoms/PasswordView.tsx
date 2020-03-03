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
  background: #fff;
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
  margin: "1rem 0";
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
