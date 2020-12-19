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
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import styled, { ThemeContext } from "styled-components";
import { connect, useDispatch } from "react-redux";

import CollapsibleContainerComponent from "../../atoms/CollapsibleContainer";
import AlternateLoader from "../../atoms/Icons/AlternateLoader";
import DataCheckbox from "../../atoms/DataCheckbox";
import { Permission, PermissionsApi, PersonalAccount, PersonalAccountApi, Role } from "../../api";
import { getApiConfig } from "../../api/apiConfig";
import { beginApiCall, endApiCall } from "../../redux/actions/apiStatusActions";
import { getAllRoles, getPersonalAccountById, updateUserRoles } from "../../redux/actions/roleActions";

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
  const {
    accountName,
    accountId,
    collapsedByDefault,
    updateUserRoles,
    getAllRoles,
    getPersonalAccountById,
    profile,
    loading,
    role
  } = props;

  const theme = useContext(ThemeContext);

  const preCheckEnabledRole = (theRole: Role): boolean => {
    return theRole.name === "administrator" && profile && accountId === profile.id;
  };

  const preCheckRole = (theRole: Role): boolean => {
    return role.selectedUser.roles.findIndex((entry: Role) => entry.name === theRole.name) > -1;
  };

  return (
    <CollapsibleContainerComponent
      collapsedByDefault={collapsedByDefault}
      title={accountName}
      onExpand={() => {
        if (!role.roles) {
          getAllRoles();
        }
        getPersonalAccountById(accountId);
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
            updateUserRoles(accountId, permissions);
          }}>
          {loading ? <AlternateLoader size={32} color={theme.alternateLoader.color} /> : null}
          {role.roles.map((theRole: Role) => {
            <Label htmlFor={accountId + theRole.id} key={theRole.id}>
              <DataCheckbox
                initialCheckedValue={preCheckRole(theRole)}
                disabled={preCheckEnabledRole(theRole)}
                type="checkbox"
                name={theRole.name}
                value={theRole.name}
                id={accountId + theRole.id}
                parentIsLoading={false}
                parentPutError={false}
                onChange={e =>
                  e.currentTarget.closest("form")?.dispatchEvent(new Event("submit", { cancelable: true }))
                }
              />
              {theRole.name}
            </Label>;
          })}
        </form>
      </AuthorizationContainer>
    </CollapsibleContainerComponent>
  );
}

function mapStateToProps(state: any) {
  return {
    profile: state.profile,
    token: state.token,
    loading: state.apiCallsInProgress > 0,
    role: state.role
  };
}

const mapDispatchToProps = {
  beginApiCall,
  endApiCall,
  getAllRoles,
  getPersonalAccountById,
  updateUserRoles
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleAuthorizationComponent);
