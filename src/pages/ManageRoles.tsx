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
import React, { useEffect, useReducer } from "react";

import PageHeader from "../atoms/PageHeader";
import SearchInput from "../atoms/SearchInput";
import ISearchResult from "../interfaces/ISearchResult";
import FlexRow from "../atoms/FlexRow";
import FlexColumn from "../atoms/FlexColumn";
import styled from "styled-components";
import useDataApi from "../hooks/useDataApi";
import { customGenericDataFetchReducer } from "../stores/genericDataFetchReducer";
import DataRequest from "../types/DataRequest";
import useToken from "../hooks/useToken";
import UserAuthorizationComponent from "../molecules/UserAuthorizationComponent";
import IPersonalAccount from "../interfaces/IPersonalAccount";
import IRole from "../interfaces/IRole";
import { generateMediaQuery } from "../layout/utils";

const FlexRowContainer = styled(FlexRow)`
  max-width: 20rem;

  ${generateMediaQuery(
    "max-width",
    "md",
    `
    max-width: 100%;    `
  )};
`;

const FlexColumnContainer = styled(FlexColumn)`
  width: 100%;
`;

interface IExistingUserApiResponse {
  isLoading: boolean;
  data: Array<IPersonalAccount>;
}

interface IRolesApiResponse {
  isLoading: boolean;
  data: Array<IRole>;
}

export enum ManageRolesActionTypes {
  SETUSER = "setuser",
  UNSETUSER = "unsetuser"
}

export type ManageRolesAction =
  | { type: ManageRolesActionTypes.SETUSER; user: IPersonalAccount }
  | { type: ManageRolesActionTypes.UNSETUSER };

interface IManageRolesState {
  user: IPersonalAccount;
}

const manageRolesReducer = (
  state: IManageRolesState,
  action: ManageRolesAction
) => {
  switch (action.type) {
    case ManageRolesActionTypes.SETUSER:
      return {
        ...state,
        user: action.user
      };
    case ManageRolesActionTypes.UNSETUSER:
      return {
        ...state,
        user: {} as IPersonalAccount
      };
  }
};

const ManageRoles = () => {
  const [localStorageToken] = useToken();

  const [state, dispatch] = useReducer(manageRolesReducer, {
    user: {} as IPersonalAccount
  });

  const [existingUsersApiResponse, setExistingUsersApiRequest] = useDataApi<
    IExistingUserApiResponse,
    Array<IPersonalAccount>
  >(customGenericDataFetchReducer);

  const [rolesApiResponse, setRolesApiRequest] = useDataApi<
    IRolesApiResponse,
    Array<IRole>
  >(customGenericDataFetchReducer);

  const [searchUserApiResponse, setSearchUserApiResponse] = useDataApi<
    IExistingUserApiResponse,
    Array<IPersonalAccount>
  >(customGenericDataFetchReducer);

  useEffect(() => {
    const getRolesDataRequest: DataRequest = {
      method: "get",
      token: localStorageToken,
      url: `/api/permissions/global/role`,
      cbSuccess: roles => {
        roles.map((role: IRole) => {
          const getExistingUsersDataRequest: DataRequest = {
            method: "get",
            params: {
              roleName: role.name
            },
            token: localStorageToken,
            url: `/api/personalaccount`
          };

          setExistingUsersApiRequest(getExistingUsersDataRequest);
        });
      }
    };

    setRolesApiRequest(getRolesDataRequest);
  }, []);

  const parseSearchInputResults = (
    apiResponse: IExistingUserApiResponse
  ): Array<ISearchResult> => {
    if (apiResponse.data && apiResponse.data.length > 0) {
      const searchInputResults: Array<ISearchResult> = apiResponse.data.map(
        entry =>
          ({
            id: entry.id,
            displayLabel: entry.name
          } as ISearchResult)
      );

      return searchInputResults;
    }

    return [];
  };

  return (
    <>
      <PageHeader>Manage roles</PageHeader>
      <FlexRowContainer>
        <FlexColumnContainer>
          <SearchInput
            results={parseSearchInputResults(searchUserApiResponse)}
            onSelect={selectedSearchResult => {
              dispatch({
                type: ManageRolesActionTypes.SETUSER,
                user: {
                  id: selectedSearchResult.id,
                  name: selectedSearchResult.displayLabel
                } as IPersonalAccount
              });
            }}
            onCancel={() =>
              dispatch({
                type: ManageRolesActionTypes.UNSETUSER
              })
            }
            fetchData={searchQuery => {
              const searchUserRequest: DataRequest = {
                method: "get",
                params: {
                  name: searchQuery
                },
                token: localStorageToken,
                url: `/api/personalaccount`
              };

              setSearchUserApiResponse(searchUserRequest);
            }}
            isLoading={false}
            defaultLabel={"Search user"}
            onSelectLabel={"Selected user"}
          />
          {Object.keys(state.user).length > 0 ? (
            <UserAuthorizationComponent
              key={state.user.id}
              accountId={state.user.id}
              accountName={state.user.name}
              collapsedByDefault={false}
              type="role"
              roles={rolesApiResponse.data}
            />
          ) : null}
          {existingUsersApiResponse.data
            ? existingUsersApiResponse.data
                .filter(user => user.id !== state.user.id)
                .map(user => (
                  <UserAuthorizationComponent
                    key={user.id}
                    accountId={user.id}
                    accountName={user.name}
                    collapsedByDefault={true}
                    type="role"
                    roles={rolesApiResponse.data}
                  />
                ))
            : null}
        </FlexColumnContainer>
      </FlexRowContainer>
    </>
  );
};

export default ManageRoles;
