/*
 * Copyright (C) 2019 - 2020 Rabobank Nederland
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

import {useFormik} from 'formik';
import React from 'react';
import { useHistory  } from "react-router-dom";

import styled from 'styled-components';
import Button from '../atoms/Button';
import InputErrorLabel from '../atoms/InputErrorLabel';
import FormInput from '../molecules/FormInput';
import {validateEmail} from '../validation/utils';

const LoginFormContainer = styled.div`
  background-color: #fff;
  margin: 10% auto;
  width: 20rem;
  box-shadow: 0 3px 20px 0px rgba(0, 0, 0, 0.1);
  padding: 1.75rem 2rem 2rem;
`;

const LoginFormHeader = styled.img`
  height: 4.25rem;
  margin: 2rem auto 4rem;
  display: flex;
  max-width: 100%;
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin: 1rem 0;
  font-size: 1rem;
`;

interface ILoginFormValues {
  email: string;
  password: string;
}

const validate = (values: ILoginFormValues) => {
  const emailError = 'Please fill in a valid email';
  const errors = {} as any;

  if (!values.email) {
    errors.email = emailError;
  } else if (!validateEmail(values.email)) {
    errors.email = emailError; 
  }

  if (!values.password) {
    errors.password = 'Please fill in a password';
  }

  return errors;
};

const LoginForm: React.FC = () => {
  const history = useHistory();  

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      history.push('/dashboard');    
    },
    validate,
  });

  return (
    <LoginFormContainer>
      <LoginFormHeader src="images/logo.svg" />
      <form onSubmit={formik.handleSubmit}>
        <FormInput
          labelValue={'Username'}
          placeHolder={'Username'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          name="email"
          formType={'text'}
        />
        {formik.touched.email && formik.errors.email ? (
          <InputErrorLabel>{formik.errors.email}</InputErrorLabel>
        ) : null}
         <FormInput
          labelValue={'Password'}
          placeHolder={'Password'}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.password}
          name="password"
          formType={'password'}
        />
        {formik.touched.password && formik.errors.password ? (
          <InputErrorLabel disableMargin={true}>{formik.errors.password}</InputErrorLabel>
        ) : null}
        <LoginButton type="submit">Login</LoginButton>
      </form>
    </LoginFormContainer>
  );
};

export default LoginForm;
