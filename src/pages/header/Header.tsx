import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import AvatarMenuRoot from "./AvatarMenuRoot";
import { Role } from "../../api";

const StyledNavLink = styled(NavLink)`
  background-color: ${props => props.theme.header.navigation.loginButton.default.loginButtonBgColor};
  border: 1px solid ${props => props.theme.header.navigation.loginButton.default.loginButtonBorderColor};
  color: ${props => props.theme.header.navigation.loginButton.default.loginButtonTextColor};
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  display: flex;
  transition: background-color 0.25s ease-out, color 0.25s ease-out;

  &:hover {
    background-color: ${props => props.theme.header.navigation.loginButton.hover.loginButtonBgColor};
    border: 1px solid ${props => props.theme.header.navigation.loginButton.hover.loginButtonBorderColor};
    color: ${props => props.theme.header.navigation.loginButton.hover.loginButtonTextColor};
  }
`;

const StyledHeader = styled.header`
  display: flex;
  flex-direction: row;
  padding: 0.5rem 0.75rem;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.header.bgColor};
  min-height: 50px;
  box-sizing: border-box;
`;

const Brand = styled.img`
  height: 2rem;
`;

const LinkContainer = styled.li`
  margin: 0 1rem;

  a {
    color: ${props => props.theme.dashboardNavBar.link.textColor};
    padding: 0.5rem;
    font-weight: 700;
    text-decoration: none;

    &:hover {
      background-color: ${props => props.theme.dashboardNavBar.link.hover.bgColor};
    }
  }
`;

const Ul = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

function isAdmin(roles: Role[]): boolean {
  return roles.filter(role => role.name === "administrator").length > 0;
}

function Header(props: any) {
  const { profile, token } = props;
  return (
    <StyledHeader>
      <Link to="/" style={{ display: "flex" }}>
        <Brand src="/images/logo.svg" />
      </Link>
      <nav>
        <Ul>
          {token && token.token ? (
            <>
              {profile && profile.roles && isAdmin(profile.roles) ? (
                <LinkContainer>
                  <Link to={"/settings"}>Settings</Link>
                </LinkContainer>
              ) : null}
              <AvatarMenuRoot />
            </>
          ) : (
            <StyledNavLink to="/login">Sign in</StyledNavLink>
          )}
        </Ul>
      </nav>
    </StyledHeader>
  );
}

function mapStateToProps(state: any) {
  return {
    profile: state.profile,
    token: state.token
  };
}

export default connect(mapStateToProps)(Header);
