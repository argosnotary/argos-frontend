import React from "react";
import styled from "styled-components";
import Button from "../atoms/Button";
import FormInput from "../molecules/FormInput";

const LoginFormContainer = styled.div`
  background-color: #fff;
  margin: 10% auto;
  width: 20rem;
  box-shadow: 0 3px 20px 0px rgba(0, 0, 0, 0.1);
  padding: 1.75rem 2rem 2rem;
`;

const LoginFormHeader = styled.h1`
  font-size: 2.75rem;
  margin: 0.5rem 2rem 2rem;
  text-align: center;
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin: 1rem 0;
  font-size: 1rem;
`;

const LoginForm: React.FC = () => (
  <LoginFormContainer>
    <LoginFormHeader>Argos</LoginFormHeader>
    <form>
      <FormInput
        labelValue={"Username"}
        placeHolder={"Username"}
        formType={"text"}
      />
      <FormInput
        labelValue={"Password"}
        placeHolder={"Password"}
        formType={"password"}
      />
      <LoginButton>Login</LoginButton>
    </form>
  </LoginFormContainer>
);

export default LoginForm;
