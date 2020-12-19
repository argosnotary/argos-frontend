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
import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { connect, useDispatch } from "react-redux";

import PageHeader from "../../atoms/PageHeader";
import SearchInput from "./SearchInput";
//import ISearchResult from "../interfaces/ISearchResult";
import { FlexRow, FlexRowContainer, FlexColumnContainer } from "../../atoms/Flex";
import styled from "styled-components";
//import useDataApi from "../hooks/useDataApi";
//import { customGenericDataFetchReducer } from "../stores/genericDataFetchReducer";
//import DataRequest from "../types/DataRequest";
//import IPersonalAccount from "../interfaces/IPersonalAccount";
//import IRole from "../interfaces/IRole";
import RoleAuthorizationComponent from "./RoleAuthorizationComponent";
import { PermissionsApi, PersonalAccount, PersonalAccountApi, Role } from "../../api";
import { getApiConfig } from "../../api/apiConfig";
import SearchResult from "../../model/SearchResult";
import { Profile } from "../../api";
//import { refreshToken } from "../../redux/actions/tokenActions";
import { beginApiCall, endApiCall } from "../../redux/actions/apiStatusActions";
import {
  getAllRoles,
  searchAdministrators,
  searchAccounts,
  getPersonalAccountById,
  updateUserRoles,
  cancelSelectingUser
} from "../../redux/actions/roleActions";

export enum ManageRolesActionTypes {
  SETUSER = "setuser",
  UNSETUSER = "unsetuser"
}

export type ManageRolesAction =
  | { type: ManageRolesActionTypes.SETUSER; user: PersonalAccount }
  | { type: ManageRolesActionTypes.UNSETUSER };

interface ManageRolesState {
  user: PersonalAccount;
}

const manageRolesReducer = (state: ManageRolesState, action: ManageRolesAction) => {
  switch (action.type) {
    case ManageRolesActionTypes.SETUSER:
      return {
        ...state,
        user: action.user
      };
    case ManageRolesActionTypes.UNSETUSER:
      return {
        ...state,
        user: {} as PersonalAccount
      };
  }
};

function ManageRoles(props: any) {
  const {
    token,
    profile,
    refreshToken,
    beginApiCall,
    endApiCall,
    getAllRoles,
    searchAdministrators,
    searchAccounts,
    getPersonalAccountById,
    updateUserRoles,
    cancelSelectingUser,
    loading,
    role
  } = props;
  const [roles, setRoles] = useState([] as Array<Role>);
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    getAllRoles();
    searchAdministrators();
  }, []);

  const parseUsers = (users: Array<PersonalAccount> | undefined): Array<SearchResult> => {
    if (users && users.length > 0) {
      return users.map(entry => {
        return {
          id: entry.id || "",
          displayLabel: entry.name || ""
        };
      });
    }
    return [];
  };

  return (
    <>
      <PageHeader>Manage roles</PageHeader>
      <FlexRowContainer>
        <FlexColumnContainer>
          <SearchInput
            entries={parseUsers(role.users)}
            onSelect={selectedSearchResult =>
              selectedSearchResult ? getPersonalAccountById(selectedSearchResult.id) : null
            }
            onCancel={() => cancelSelectingUser()}
            fetchData={searchQuery => searchAccounts(searchQuery)}
            isLoading={loading}
            defaultLabel={"Search user"}
            onSelectLabel={"Selected user"}
            placeHolder={"Name"}
          />
          {role.selectedUser ? (
            <RoleAuthorizationComponent
              key={role.selectedUser.id}
              accountId={role.selectedUser.id}
              accountName={role.selectedUser.name}
              collapsedByDefault={false}
            />
          ) : null}
          {role.administrators
            ? role.administrators.map((user: PersonalAccount) => (
                <RoleAuthorizationComponent
                  key={user.id}
                  accountId={user.id}
                  accountName={user.name}
                  collapsedByDefault={true}
                />
              ))
            : null}
        </FlexColumnContainer>
      </FlexRowContainer>
    </>
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
  searchAdministrators,
  searchAccounts,
  getPersonalAccountById,
  updateUserRoles,
  cancelSelectingUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageRoles);
