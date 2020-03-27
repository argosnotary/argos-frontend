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
import { StateContext } from "../../../stores/layoutEditorStore";
import ContentSeparator from "../../../atoms/ContentSeparator";
import ISearchResult from "../../../interfaces/ISearchResult";
import SearchInput from "../../../atoms/SearchInput";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer, {
  customGenericDataFetchReducer
} from "../../../stores/genericDataFetchReducer";
import DataRequest from "../../../types/DataRequest";
import useToken from "../../../hooks/useToken";
import CollapsibleContainerComponent from "../../../atoms/CollapsibleContainer";
import styled, { ThemeContext } from "styled-components";
import AlternateLoader from "../../../atoms/Icons/AlternateLoader";
import DataCheckbox from "../../../atoms/DataCheckbox";

const PermissionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PermissionLabel = styled.label`
  display: flex;
  position: relative;
  padding: 0.25rem;
  align-items: center;
`;

interface IPermissionsComponentProps {
  labelId: string;
  accountId: string;
  accountName: string;
  collapsedByDefault: boolean;
}

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

interface IPermissionsApiState {
  isLoading: boolean;
  data: IUserPermissions;
}

interface IPermission {
  id: string;
  label: string;
}

interface IUserPermissions {
  labelId: string;
  permissions: Array<string>;
}

const permissionTypes = [
  { id: "LAYOUT_ADD", label: "add a layout" },
  { id: "LINK_ADD", label: "add a link" },
  { id: "LOCAL_PERMISSION_EDIT", label: "change permissions" },
  { id: "TREE_EDIT", label: "change tree" },
  { id: "READ", label: "read" },
  { id: "VERIFY", label: "verify supply chains" },
  { id: "NPA_EDIT", label: "add npa" }
];

const PermissionsComponent: React.FC<IPermissionsComponentProps> = ({
  labelId,
  accountId,
  accountName,
  collapsedByDefault
}) => {
  const [
    updatePermissionApiResponse,
    setUpdatePermissionApiRequest
  ] = useDataApi(genericDataFetchReducer);

  const [permissionsApiResponse, setPermissionsApiRequest] = useDataApi<
    IPermissionsApiState,
    IUserPermissions
  >(customGenericDataFetchReducer);

  const [localStorageToken] = useToken();

  const theme = useContext(ThemeContext);

  const shouldBeChecked = (permission: IPermission): boolean => {
    if (!permissionsApiResponse.data.permissions) {
      return false;
    }

    return (
      permissionsApiResponse.data.permissions.findIndex(
        (entry: any) => entry === permission.id
      ) > -1
    );
  };

  useEffect(() => {
    if (!collapsedByDefault) {
      const dataRequest: DataRequest = {
        method: "get",
        token: localStorageToken,
        url: `/api/personalaccount/${accountId}/localpermission/${labelId}`
      };

      setPermissionsApiRequest(dataRequest);
    }
  }, [accountId]);

  return (
    <CollapsibleContainerComponent
      collapsedByDefault={collapsedByDefault}
      title={`Permissions for ${accountName}`}
      onCollapse={() => {
        if (permissionsApiResponse && permissionsApiResponse.data) {
          return;
        }

        const dataRequest: DataRequest = {
          method: "get",
          token: localStorageToken,
          url: `/api/personalaccount/${accountId}/localpermission/${labelId}`
        };

        setPermissionsApiRequest(dataRequest);
      }}
    >
      <PermissionsContainer>
        <form
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const permissions = [];

            for (const [_key, value] of formData.entries()) {
              permissions.push(value);
            }

            const dataRequest: DataRequest = {
              method: "put",
              data: [...permissions],
              token: localStorageToken,
              url: `/api/personalaccount/${accountId}/localpermission/${labelId}`
            };

            setUpdatePermissionApiRequest(dataRequest);
          }}
        >
          {permissionsApiResponse.isLoading ? (
            <AlternateLoader size={32} color={theme.alternateLoader.color} />
          ) : null}
          {Object.prototype.hasOwnProperty.call(permissionsApiResponse, "data")
            ? permissionTypes.map(permission => {
                return (
                  <PermissionLabel htmlFor={permission.id} key={permission.id}>
                    <DataCheckbox
                      initialCheckedValue={shouldBeChecked(permission)}
                      type="checkbox"
                      name={permission.id}
                      value={permission.id}
                      id={permission.id}
                      parentIsLoading={updatePermissionApiResponse.isLoading}
                      parentPutError={
                        updatePermissionApiResponse.error ? true : false
                      }
                      onChange={e =>
                        e.currentTarget
                          .closest("form")
                          ?.dispatchEvent(
                            new Event("submit", { cancelable: true })
                          )
                      }
                    />
                    {permission.label}
                  </PermissionLabel>
                );
              })
            : null}
        </form>
      </PermissionsContainer>
    </CollapsibleContainerComponent>
  );
};

const UserPermissions: React.FC<IEditSearchedUserPermissionsProps> = ({
  selectedLabelId
}) => {
  const [localStorageToken] = useToken();
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
      token: localStorageToken,
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
              <PermissionsComponent
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
            token: localStorageToken,
            url: `/api/personalaccount`
          };

          setSearchUserApiRequest(dataRequest);
        }}
        isLoading={searchUserApiResponse.isLoading}
      />
      {Object.keys(user).length > 0 ? (
        <>
          <PermissionsComponent
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
    <div>
      <NodesBreadCrumb>
        Selected: {state.breadcrumb}
        <LastBreadCrumb>
          {state.breadcrumb.length > 0 ? " / " : ""}
          {state.selectedNodeName}
        </LastBreadCrumb>
      </NodesBreadCrumb>
      <ContentSeparator />
      <UserPermissions selectedLabelId={state.nodeReferenceId} />
    </div>
  );
};

export default ManageLabelPermissions;
