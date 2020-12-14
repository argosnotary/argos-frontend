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
import React from "react";
import styled from "styled-components";

import CollapsibleContainerComponent from "../atoms/CollapsibleContainer";
//import AlternateLoader from "../atoms/Icons/AlternateLoader";
import { Permission, PersonalAccount, Role } from "../api";
import Form from "react-bootstrap/Form";

const AuthorizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

interface AuthorizationComponentProps {
  user: PersonalAccount;
  updateHandler: (user: PersonalAccount, authorization: Role | Permission, isChecked: boolean) => void;
  preCheckAuthorization: (authorization: Role | Permission, user: PersonalAccount) => boolean;
  loading: true;
  collapsedByDefault: boolean;
  disabled: boolean;
  getDescription: (authorization: Role | Permission) => string;
  authorizations: Array<Role | Permission>;
}

function AuthorizationComponent(props: AuthorizationComponentProps): React.ReactElement {
  const {
    user,
    disabled,
    collapsedByDefault,
    updateHandler,
    preCheckAuthorization,
    loading,
    getDescription,
    authorizations
  } = props;

  return (
    <CollapsibleContainerComponent
      collapsedByDefault={collapsedByDefault}
      title={user.name ? user.name : ""}
      onExpand={() => {
        return true;
      }}>
      <AuthorizationContainer>
        <Form>
          {authorizations
            ? authorizations.map((authorization: Role | Permission) => (
                <div key={authorization}>
                  <Form.Check
                    type="checkbox"
                    id={authorization}
                    label={getDescription(authorization)}
                    checked={preCheckAuthorization(authorization, user)}
                    disabled={disabled}
                    onChange={event => updateHandler(user, authorization, event.currentTarget.checked)}
                  />
                </div>
              ))
            : []}
        </Form>
      </AuthorizationContainer>
    </CollapsibleContainerComponent>
  );
}

export default AuthorizationComponent;
