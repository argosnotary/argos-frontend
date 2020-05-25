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
import React, { useContext, useEffect } from "react";
import styled, { ThemeContext } from "styled-components";

import useDataApi from "../hooks/useDataApi";
import genericDataFetchReducer, {
  customGenericDataFetchReducer
} from "../stores/genericDataFetchReducer";
import CollapsibleContainerComponent from "../atoms/CollapsibleContainer";
import DataRequest from "../types/DataRequest";
import AlternateLoader from "../atoms/Icons/AlternateLoader";
import DataCheckbox from "../atoms/DataCheckbox";
import { useUserProfileContext } from "../stores/UserProfile";

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
    roles: Array<IRole>;
  };
  error?: string;
}

const RoleAuthorizationComponent: React.FC<IRoleAuthorizationComponentProps> = ({
  accountId,
  accountName,
  collapsedByDefault,
  roles
}) => {
  const [updateRolesApiResponse, setUpdateRolesApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [rolesApiResponse, setRolesApiRequest] = useDataApi<
    IRolesApiState,
    Array<IRole>
  >(customGenericDataFetchReducer);

  const { token } = useUserProfileContext();

  const theme = useContext(ThemeContext);

  const userProfile = useUserProfileContext();

  const preCheckEnabledRole = (role: IRole): boolean => {
    return (
      role.name === "administrator" &&
      userProfile.profile !== undefined &&
      accountId === userProfile.profile.personalAccount.id
    );
  };

  const preCheckRole = (role: IRole): boolean => {
    if (!rolesApiResponse.data.roles) {
      return false;
    }

    return (
      rolesApiResponse.data.roles.findIndex(
        (entry: IRole) => entry.name === role.name
      ) > -1
    );
  };

  const getGlobalRoles = () => {
    const dataRequest: DataRequest = {
      method: "get",
      token,
      url: `/api/personalaccount/${accountId}`
    };

    setRolesApiRequest(dataRequest);
  };

  const putGlobalRoles = (data: Array<string>) => {
    const dataRequest: DataRequest = {
      method: "put",
      data,
      token,
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

    return roles?.map(role => (
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
          onChange={e =>
            e.currentTarget
              .closest("form")
              ?.dispatchEvent(new Event("submit", { cancelable: true }))
          }
        />
        {role.name}
      </Label>
    ));
  };

  return (
    <CollapsibleContainerComponent
      enabled={true}
      collapsedByDefault={collapsedByDefault}
      title={`${accountName}`}
      onCollapse={() => {
        if (rolesApiResponse && rolesApiResponse.data) {
          return;
        }
        getGlobalRoles();
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
          {rolesApiResponse.isLoading ? (
            <AlternateLoader size={32} color={theme.alternateLoader.color} />
          ) : null}
          {renderGlobalRoles(rolesApiResponse)}
        </form>
      </AuthorizationContainer>
    </CollapsibleContainerComponent>
  );
};

export default RoleAuthorizationComponent;
