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
import React, { useContext, useEffect, useState } from "react";
import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import ContentSeparator from "../../../atoms/ContentSeparator";
import ISearchResult from "../../../interfaces/ISearchResult";
import SearchInput from "../../../atoms/SearchInput";
import useDataApi from "../../../hooks/useDataApi";
import { customGenericDataFetchReducer } from "../../../stores/genericDataFetchReducer";
import DataRequest from "../../../types/DataRequest";
import { ThemeContext } from "styled-components";
import AlternateLoader from "../../../atoms/Icons/AlternateLoader";
import LabelAuthorizationComponent from "../../../molecules/LabelAuthorizationComponent";
import { Panel } from "../../../molecules/Panel";
import { StateContext } from "../HierarchyEditor";
import { useUserProfileContext } from "../../../stores/UserProfile";

interface IEditSearchedUserPermissionsProps {
  selectedLabelId: string;
}

interface IUser {
  id: string;
  name: string;
}

interface IKnownUser {
  id: string;
  name: string;
  email: string;
}

interface IAllKnownUsersApiResponse {
  isLoading: boolean;
  data: Array<IKnownUser>;
}

interface ISearchApiUser {
  id: string;
  name: string;
  email: string;
}

interface ISearchUserApiResponse {
  isLoading: boolean;
  data: Array<ISearchApiUser>;
}

const UserPermissions: React.FC<IEditSearchedUserPermissionsProps> = ({
  selectedLabelId
}) => {
  const { token } = useUserProfileContext();
  const [user, setUser] = useState({} as IUser);

  const [searchUserApiResponse, setSearchUserApiRequest] = useDataApi<
    ISearchUserApiResponse,
    Array<ISearchApiUser>
  >(customGenericDataFetchReducer);

  const [
    allKnownUsersApiResponse,
    setAllKnownLabelUsersApiRequest
  ] = useDataApi<IAllKnownUsersApiResponse, Array<IKnownUser>>(
    customGenericDataFetchReducer
  );

  const theme = useContext(ThemeContext);

  useEffect(() => {
    const dataRequest: DataRequest = {
      method: "get",
      params: {
        localPermissionsLabelId: selectedLabelId
      },
      token,
      url: `/api/personalaccount`
    };

    setAllKnownLabelUsersApiRequest(dataRequest);
  }, [selectedLabelId]);

  const parseSearchInputResults = (
    apiResponse: Array<ISearchApiUser>
  ): Array<ISearchResult> => {
    if (apiResponse && apiResponse.length > 0) {
      const searchInputResults: Array<ISearchResult> = apiResponse.map(
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

  const renderKnownUsers = (allKnownUsers: Array<IKnownUser>) => {
    if (allKnownUsers) {
      return (
        <>
          {allKnownUsers.filter((entry: any) => entry.id !== user.id).length >
          1 ? (
            <ContentSeparator />
          ) : null}
          {allKnownUsers
            .filter((entry: any) => entry.id !== user.id)
            .map((knownUser: any) => (
              <LabelAuthorizationComponent
                key={knownUser.id}
                labelId={selectedLabelId}
                accountId={knownUser.id}
                accountName={knownUser.name}
                collapsedByDefault={true}
              />
            ))}
        </>
      );
    }

    return null;
  };

  return (
    <>
      <SearchInput
        results={parseSearchInputResults(searchUserApiResponse.data)}
        onSelect={(selectedSearchResult: ISearchResult) => {
          setUser({
            id: selectedSearchResult.id,
            name: selectedSearchResult.displayLabel
          });
        }}
        onCancel={() => {
          setUser({} as IUser);
        }}
        fetchData={(searchQuery: string) => {
          const dataRequest: DataRequest = {
            method: "get",
            params: {
              name: searchQuery
            },
            token,
            url: `/api/personalaccount`
          };

          setSearchUserApiRequest(dataRequest);
        }}
        isLoading={searchUserApiResponse.isLoading}
        defaultLabel={"Search user"}
        onSelectLabel={"Selected user"}
      />
      {Object.keys(user).length > 0 ? (
        <>
          <LabelAuthorizationComponent
            labelId={selectedLabelId}
            accountId={user.id}
            accountName={user.name}
            collapsedByDefault={false}
          />
        </>
      ) : null}
      {allKnownUsersApiResponse.isLoading ? (
        <AlternateLoader size={32} color={theme.alternateLoader.color} />
      ) : null}
      {renderKnownUsers(allKnownUsersApiResponse.data)}
    </>
  );
};

const ManageLabelPermissions = () => {
  const [state] = useContext(StateContext);

  return (
    <Panel
      maxWidth={"37.5vw"}
      resizable={false}
      last={true}
      title={"Manage label permissions"}>
      <NodesBreadCrumb>
        Selected: {state.breadcrumb}
        <LastBreadCrumb>
          {state.breadcrumb.length > 0 ? " / " : ""}
          {state.selectedNodeName}
        </LastBreadCrumb>
      </NodesBreadCrumb>
      <ContentSeparator />
      <UserPermissions selectedLabelId={state.nodeReferenceId} />
    </Panel>
  );
};

export default ManageLabelPermissions;
