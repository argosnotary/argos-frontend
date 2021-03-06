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
import React, { ReactNode } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

interface INavbar {
  children: ReactNode;
  homeUrl: string;
}

const Header = styled.header`
  display: flex;
  flex-direction: row;
  padding: 0.5rem 0.75rem;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.homePage.navigation.bgColor};
  min-height: 50px;
  box-sizing: border-box;
`;

const Ul = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Brand = styled.img`
  height: 2rem;
`;

const Navbar: React.FC<INavbar> = ({ children, homeUrl }: INavbar) => {
  return (
    <Header>
      <Link to={homeUrl} style={{ display: "flex" }}>
        <Brand src="/images/logo.svg" />
      </Link>
      <nav>
        <Ul>{children}</Ul>
      </nav>
    </Header>
  );
};

export default Navbar;
