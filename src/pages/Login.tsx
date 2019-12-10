import React from "react";
import styled from "styled-components";
import LoginForm from "../organisms/LoginForm";

const LoginPageContainer = styled.section`
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.loginPage.bgColor};
`;

const LoginPage: React.FC = () => (
  <LoginPageContainer>
    <LoginForm />
  </LoginPageContainer>
);

export default LoginPage;
