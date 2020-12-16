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
import React, { useContext, useEffect } from "react";
import styled, { ThemeContext } from "styled-components";
import { connect } from "react-redux";

import CollapsibleContainerComponent from "../../atoms/CollapsibleContainer";
import AlternateLoader from "../../atoms/Icons/AlternateLoader";
import DataCheckbox from "../../atoms/DataCheckbox";
import { Role } from "../../api";

const AuthorizationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled.label`
  display: flex;
  position: relative;
  padding: 0.25rem;
  align-items: center;
`;

interface IRoleAuthorizationComponentProps {
  labelId?: string;
  accountId: string;
  accountName: string;
  collapsedByDefault: boolean;
  roles?: Array<IRole>;
}

interface IRole {
  id: string;
  name: string;
}

interface IRolesApiState {
  isLoading: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    roles: Array<Role>;
  };
  error?: string;
}

function RoleAuthorizationComponent(props: any) {
  const { labelId, accountId, accountName, collapsedByDefault, roles, administrators, profile } = props;
  const [updateRolesApiResponse, setUpdateRolesApiRequest] = useDataApi(genericDataFetchReducer);

  const [rolesApiResponse, setRolesApiRequest] = useDataApi<IRolesApiState, Array<IRole>>(
    customGenericDataFetchReducer
  );

  const theme = useContext(ThemeContext);

  const preCheckEnabledRole = (role: Role): boolean => {
    return role.name === "administrator" && profile && accountId === profile.id;
  };

  const preCheckRole = (role: Role): boolean => {
    if (!roles || roles.length === 0) {
      return false;
    }

    return roles.findIndex((entry: Role) => entry.name === role.name) > -1;
  };

  const getGlobalRoles = () => {
    const dataRequest: DataRequest = {
      method: "get",
      url: `/api/personalaccount/${accountId}`
    };

    setRolesApiRequest(dataRequest);
  };

  const putGlobalRoles = (data: Array<string>) => {
    const dataRequest: DataRequest = {
      method: "put",
      data,
      url: `/api/personalaccount/${accountId}/role`
    };

    setUpdateRolesApiRequest(dataRequest);
  };

  useEffect(() => {
    if (!collapsedByDefault) {
      getGlobalRoles();
    }
  }, [accountId]);

  const renderGlobalRoles = (rolesApiResponse: IRolesApiState) => {
    if (!rolesApiResponse.data) {
      return null;
    }

    return roles.map((role: Role) => (
      <Label htmlFor={accountId + role.id} key={role.id}>
        <DataCheckbox
          initialCheckedValue={preCheckRole(role)}
          disabled={preCheckEnabledRole(role)}
          type="checkbox"
          name={role.name}
          value={role.name}
          id={accountId + role.id}
          parentIsLoading={updateRolesApiResponse.isLoading}
          parentPutError={updateRolesApiResponse.error ? true : false}
          onChange={e => e.currentTarget.closest("form")?.dispatchEvent(new Event("submit", { cancelable: true }))}
        />
        {role.name}
      </Label>
    ));
  };

  return (
    <CollapsibleContainerComponent
      collapsedByDefault={collapsedByDefault}
      title={`${accountName}`}
      onExpand={() => {
        if (rolesApiResponse && rolesApiResponse.data) {
          return true;
        }
        getGlobalRoles();
        return true;
      }}>
      <AuthorizationContainer>
        <form
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const permissions: Array<string> = [];
            for (const value of formData.values()) {
              permissions.push(value as string);
            }

            putGlobalRoles([...permissions]);
          }}>
          {rolesApiResponse.isLoading ? <AlternateLoader size={32} color={theme.alternateLoader.color} /> : null}
          {renderGlobalRoles(rolesApiResponse)}
        </form>
      </AuthorizationContainer>
    </CollapsibleContainerComponent>
  );
}

function mapStateToProps(state: any) {
  return {
    profile: state.profile,
    token: state.token,
    loading: state.apiCallsInProgress > 0
  };
}

export default connect(mapStateToProps)(RoleAuthorizationComponent);
