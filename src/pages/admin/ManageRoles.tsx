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
import { connect } from "react-redux";

import PageHeader from "../../atoms/PageHeader";
import SearchInput from "../../atoms/SearchInput";
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
import ManagerRolesContainer from "./ManagerRolesContainer";
import SearchResult from "../../model/SearchResult";

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
  const { token, profile } = props;
  const [roles, setRoles] = useState([] as Array<Role>);
  const [administrators, setAdministrators] = useState([] as Array<PersonalAccount>);
  const [users, setUsers] = useState([] as Array<PersonalAccount>);
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState({} as PersonalAccount);
  const [state, dispatch] = useReducer(manageRolesReducer, {
    user: {} as PersonalAccount
  });

  const [existingUsersApiResponse, setExistingUsersApiRequest] = useDataApi<
    IExistingUserApiResponse,
    Array<IPersonalAccount>
  >(customGenericDataFetchReducer);

  const [rolesApiResponse, setRolesApiRequest] = useDataApi<IRolesApiResponse, Array<IRole>>(
    customGenericDataFetchReducer
  );

  const [searchUserApiResponse, setSearchUserApiResponse] = useDataApi<
    IExistingUserApiResponse,
    Array<IPersonalAccount>
  >(customGenericDataFetchReducer);
  useEffect(() => {
    const source = axios.CancelToken.source();
    const api = new PermissionsApi(getApiConfig(token));
    api
      .getRoles()
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          throw error;
        }
      });

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const api = new PersonalAccountApi(getApiConfig(token));
    api
      .searchPersonalAccounts("administrator")
      .then(response => {
        setAdministrators(response.data);
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          throw error;
        }
      });

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const api = new PersonalAccountApi(getApiConfig(token));
    api
      .searchPersonalAccounts(undefined, undefined, userName)
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          throw error;
        }
      });

    return () => {
      source.cancel();
    };
  }, [userName]);

  const parseAdmins = (admins: Array<PersonalAccount>): Array<SearchResult> => {
    if (admins && admins.length > 0) {
      return admins.map(entry => {
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
            entries={parseAdmins(administrators)}
            onSelect={selectedSearchResult => {
              setUser({
                id: selectedSearchResult.id,
                name: selectedSearchResult.displayLabel
              } as PersonalAccount);
            }}
            onCancel={() => setUser({})}
            fetchData={searchQuery => setUserName(searchQuery)}
            isLoading={false}
            defaultLabel={"Search user"}
            onSelectLabel={"Selected user"}
            placeHolder={"Name"}
          />
          {Object.keys(state.user).length > 0 ? (
            <RoleAuthorizationComponent
              key={state.user.id}
              accountId={state.user.id || ""}
              accountName={state.user.name || ""}
              collapsedByDefault={false}
              roles={roles}
              administrators={administrators}
            />
          ) : null}
          {existingUsersApiResponse.data
            ? existingUsersApiResponse.data
                .filter((user: any) => user.id !== state.user.id)
                .map((user: any) => (
                  <RoleAuthorizationComponent
                    key={user.id}
                    accountId={user.id}
                    accountName={user.name}
                    collapsedByDefault={true}
                    roles={roles}
                    administrators={administrators}
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
    loading: state.apiCallsInProgress > 0
  };
}

export default connect(mapStateToProps)(ManageRoles);
