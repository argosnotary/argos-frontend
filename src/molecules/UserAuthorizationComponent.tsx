import React, { useContext, useEffect } from "react";
import styled, { ThemeContext } from "styled-components";

import useDataApi from "../hooks/useDataApi";
import genericDataFetchReducer, {
  customGenericDataFetchReducer
} from "../stores/genericDataFetchReducer";
import useToken from "../hooks/useToken";
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

interface IUserAuthorizationComponentProps {
  labelId?: string;
  accountId: string;
  accountName: string;
  collapsedByDefault: boolean;
  type: "label" | "role";
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

const permissionTypes = [
  { id: "LAYOUT_ADD", label: "add a layout" },
  { id: "LINK_ADD", label: "add a link" },
  { id: "LOCAL_PERMISSION_EDIT", label: "change permissions" },
  { id: "TREE_EDIT", label: "change tree" },
  { id: "READ", label: "read" },
  { id: "VERIFY", label: "verify supply chains" }
];

const UserAuthorizationComponent: React.FC<IUserAuthorizationComponentProps> = ({
  labelId,
  accountId,
  accountName,
  collapsedByDefault,
  type
}) => {
  const [
    updatePermissionApiResponse,
    setUpdatePermissionApiRequest
  ] = useDataApi(genericDataFetchReducer);

  const [_updateRolesApiResponse, setUpdateRolesApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [permissionsApiResponse, setPermissionsApiRequest] = useDataApi<
    IPermissionsApiState,
    IUserPermissions
  >(customGenericDataFetchReducer);

  const [rolesApiResponse, setRolesApiRequest] = useDataApi<
    IRolesApiState,
    Array<IRole>
  >(customGenericDataFetchReducer);

  const [localStorageToken] = useToken();

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
      token: localStorageToken,
      url: `/api/personalaccount/${accountId}`
    };

    setRolesApiRequest(dataRequest);
  };

  const putGlobalRoles = (data: Array<string>) => {
    const dataRequest: DataRequest = {
      method: "put",
      data,
      token: localStorageToken,
      url: `/api/personalaccount/${accountId}/role`
    };

    setUpdateRolesApiRequest(dataRequest);
  };

  const getLocalPermissions = () => {
    const dataRequest: DataRequest = {
      method: "get",
      token: localStorageToken,
      url: `/api/personalaccount/${accountId}/localpermission/${labelId}`
    };

    setPermissionsApiRequest(dataRequest);
  };

  const putLocalPermissions = (data: Array<string>) => {
    const dataRequest: DataRequest = {
      method: "put",
      data,
      token: localStorageToken,
      url: `/api/personalaccount/${accountId}/localpermission/${labelId}`
    };

    setUpdatePermissionApiRequest(dataRequest);
  };

  useEffect(() => {
    if (!collapsedByDefault) {
      if (type === "label") {
        getLocalPermissions();
      }

      if (type === "role") {
        getGlobalRoles();
      }
    }
  }, [accountId]);

  const renderGlobalRoles = (rolesApiResponse: IRolesApiState) => {
    console.log(rolesApiResponse);
    if (!rolesApiResponse.data) {
      return null;
    }

    return rolesApiResponse.data.roles.map(role => (
      <Label htmlFor={role.id} key={role.id}>
        <DataCheckbox
          initialCheckedValue={preCheckRole(role)}
          type="checkbox"
          name={role.id}
          value={role.id}
          id={role.id}
          parentIsLoading={rolesApiResponse.isLoading}
          parentPutError={rolesApiResponse.error ? true : false}
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

  const renderLocalPermissions = (
    permissionsApiResponse: IPermissionsApiState
  ) => {
    if (!permissionsApiResponse.data) {
      return null;
    }

    return permissionTypes.map(permission => (
      <Label htmlFor={permission.id} key={permission.id}>
        <DataCheckbox
          initialCheckedValue={preCheckPermission(permission)}
          type="checkbox"
          name={permission.id}
          value={permission.id}
          id={permission.id}
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
      title={
        type === "label" ? `Permissions for ${accountName}` : `${accountName}`
      }
      onCollapse={() => {
        if (
          (permissionsApiResponse && permissionsApiResponse.data) ||
          (rolesApiResponse && rolesApiResponse.data)
        ) {
          return;
        }

        if (type === "label") {
          getLocalPermissions();
        }

        if (type === "role") {
          getGlobalRoles();
        }
      }}
    >
      <AuthorizationContainer>
        <form
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const permissions: Array<string> = [];

            for (const [_key, value] of formData.entries()) {
              permissions.push(value as string);
            }

            if (type === "label") {
              putLocalPermissions([...permissions]);
            }

            if (type === "role") {
              putGlobalRoles([...permissions]);
            }
          }}
        >
          {permissionsApiResponse.isLoading || rolesApiResponse.isLoading ? (
            <AlternateLoader size={32} color={theme.alternateLoader.color} />
          ) : null}
          {type === "label"
            ? renderLocalPermissions(permissionsApiResponse)
            : null}
          {type === "role" ? renderGlobalRoles(rolesApiResponse) : null}
        </form>
      </AuthorizationContainer>
    </CollapsibleContainerComponent>
  );
};

export default UserAuthorizationComponent;
