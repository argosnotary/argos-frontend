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

interface ILabelAuthorizationComponentProps {
  labelId?: string;
  accountId: string;
  accountName: string;
  collapsedByDefault: boolean;
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
  { id: "SERVICE_ACCOUNT_EDIT", label: "add service account" },
  { id: "RELEASE", label: "release" }
];

const LabelAuthorizationComponent: React.FC<ILabelAuthorizationComponentProps> = ({
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

  const theme = useContext(ThemeContext);

  const preCheckPermission = (permission: IPermission): boolean => {
    if (!permissionsApiResponse.data.permissions) {
      return false;
    }

    return (
      permissionsApiResponse.data.permissions.findIndex(
        (entry: any) => entry === permission.id
      ) > -1
    );
  };

  const getLocalPermissions = () => {
    const dataRequest: DataRequest = {
      method: "get",
      url: `/api/personalaccount/${accountId}/localpermission/${labelId}`
    };

    setPermissionsApiRequest(dataRequest);
  };

  const putLocalPermissions = (data: Array<string>) => {
    const dataRequest: DataRequest = {
      method: "put",
      data,
      url: `/api/personalaccount/${accountId}/localpermission/${labelId}`
    };

    setUpdatePermissionApiRequest(dataRequest);
  };

  useEffect(() => {
    if (!collapsedByDefault) {
      getLocalPermissions();
    }
  }, [accountId]);

  const renderLocalPermissions = (
    permissionsApiResponse: IPermissionsApiState
  ) => {
    if (!permissionsApiResponse.data) {
      return null;
    }

    return permissionTypes.map(permission => (
      <Label htmlFor={accountId + permission.id} key={permission.id}>
        <DataCheckbox
          initialCheckedValue={preCheckPermission(permission)}
          type="checkbox"
          name={permission.id}
          value={permission.id}
          id={accountId + permission.id}
          parentIsLoading={updatePermissionApiResponse.isLoading}
          parentPutError={updatePermissionApiResponse.error ? true : false}
          onChange={e =>
            e.currentTarget
              .closest("form")
              ?.dispatchEvent(new Event("submit", { cancelable: true }))
          }
        />
        {permission.label}
      </Label>
    ));
  };

  return (
    <CollapsibleContainerComponent
      collapsedByDefault={collapsedByDefault}
      title={`Permissions for ${accountName}`}
      onExpand={() => {
        if (permissionsApiResponse && permissionsApiResponse.data) {
          return true;
        }
        getLocalPermissions();
        return true;
      }}>
      <AuthorizationContainer>
        <form
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const permissions: Array<string> = [];

            for (const [_key, value] of formData.entries()) {
              permissions.push(value as string);
            }
            putLocalPermissions([...permissions]);
          }}>
          {permissionsApiResponse.isLoading ? (
            <AlternateLoader size={32} color={theme.alternateLoader.color} />
          ) : null}
          {renderLocalPermissions(permissionsApiResponse)}
        </form>
      </AuthorizationContainer>
    </CollapsibleContainerComponent>
  );
};

export default LabelAuthorizationComponent;
