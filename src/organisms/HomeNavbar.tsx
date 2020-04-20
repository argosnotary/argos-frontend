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

import React from "react";
import styled from "styled-components";

import Navbar from "../molecules/Navbar";

const ButtonLink = styled.a`
  background-color: ${props =>
    props.theme.homePage.navigation.loginButton.default.loginButtonBgColor};
  border: 1px solid
    ${props =>
      props.theme.homePage.navigation.loginButton.default
        .loginButtonBorderColor};
  color: ${props =>
    props.theme.homePage.navigation.loginButton.default.loginButtonTextColor};
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  display: flex;
  transition: background-color 0.25s ease-out, color 0.25s ease-out;

  &:hover {
    background-color: ${props =>
      props.theme.homePage.navigation.loginButton.hover.loginButtonBgColor};
    border: 1px solid
      ${props =>
        props.theme.homePage.navigation.loginButton.hover
          .loginButtonBorderColor};
    color: ${props =>
      props.theme.homePage.navigation.loginButton.hover.loginButtonTextColor};
  }
`;

const HomeNavbar = () => (
  <Navbar homeUrl={"/"}>
    <li>
      <ButtonLink href="/login">Sign in</ButtonLink>
    </li>
  </Navbar>
);

export default HomeNavbar;
