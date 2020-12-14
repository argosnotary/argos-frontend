/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";

import SearchInput from "../../organisms/SearchInput";
import { FlexRowContainer, FlexColumnContainer } from "../../atoms/Flex";
import { Permission, PersonalAccount, Role } from "../../api";
import { getUsersWithPermissions, updateUserPermissions, AccountWithPermissions } from "./localPermissionsSlice";
import { searchUsers, clearSearchedUsers } from "../common/usersSlice";
import AuthorizationComponent from "../../organisms/AuthorizationComponent";
import { FeaturePermissionEnum } from "../../util/authorization";
import { Panel } from "../../organisms/Panel";

function getDescription(authorization: Role | Permission): string {
  switch (authorization) {
    case Permission.LINK_ADD:
      return "Add a link or approve";
    case Permission.LOCAL_PERMISSION_EDIT:
      return "Manage permissions";
    case Permission.READ:
      return "Read";
    case Permission.RELEASE:
      return "Create release";
    case Permission.TREE_EDIT:
      return "Change tree";
    default:
      return "Unknown";
  }
}

function ManageLabelPermissions(props: any) {
  const {
    searchUsers,
    getUsersWithPermissions,
    updateUserPermissions,
    clearSearchedUsers,
    loading,
    localPermissions,
    label,
    users,
    featurePermission
  } = props;
  const [selectedUser, setSelectedUser] = useState<PersonalAccount>();
  const disabled: boolean = featurePermission === FeaturePermissionEnum.READ;

  useEffect(() => {
    if (!(localPermissions.usersWithPermissions.length > 0)) {
      getUsersWithPermissions(label);
    }
  }, [label]);

  function updateHandler(user: PersonalAccount, permission: any, checked: boolean) {
    let permissions: Permission[];
    const currentUser: AccountWithPermissions = localPermissions.usersWithPermissions.find(
      (account: AccountWithPermissions) => account.account.id === user.id
    );
    const userPermissions: Permission[] = currentUser ? currentUser.localPermissions.permissions : [];
    if (checked) {
      permissions = [...userPermissions, permission];
    } else {
      permissions = userPermissions.filter(thePermission => thePermission !== permission);
    }
    updateUserPermissions({ account: user, localPermissions: { labelId: label.id, permissions: permissions } });
  }

  const dispatch = useDispatch();

  function selectHandler(selectedSearchResult: any) {
    if (selectedSearchResult) {
      setSelectedUser(selectedSearchResult);
    }
    dispatch(clearSearchedUsers());
  }

  const preCheckAuthorization = (permission: Permission | Role, user: PersonalAccount): boolean => {
    if (!user.id) {
      return false;
    } else {
      const userWithPermissions = localPermissions.usersWithPermissions
        ? localPermissions.usersWithPermissions.find(
            (account: AccountWithPermissions) =>
              account.account && account.account.id && user.id && account.account.id === user.id
          )
        : null;
      const permissions: Permission[] = userWithPermissions
        ? userWithPermissions.localPermissions.permissions
        : ([] as Permission[]);
      return permissions.indexOf(permission as Permission) > -1;
    }
  };

  return (
    <Panel title={"Manage permissions"}>
      <FlexRowContainer>
        <FlexColumnContainer>
          {featurePermission === FeaturePermissionEnum.CHANGE ? (
            <SearchInput
              entries={users.searchedUsers}
              onSelect={selectHandler}
              onCancel={() => setSelectedUser(undefined)}
              fetchData={searchQuery => searchUsers(searchQuery)}
              loading={loading}
              defaultLabel={"Search user"}
              onSelectLabel={"Selected user"}
              placeHolder={"Name"}
            />
          ) : null}
          {featurePermission === FeaturePermissionEnum.CHANGE && selectedUser ? (
            <AuthorizationComponent
              key={selectedUser.id}
              user={selectedUser}
              collapsedByDefault={false}
              updateHandler={updateHandler}
              preCheckAuthorization={preCheckAuthorization}
              authorizations={Object.values(Permission)}
              loading={loading}
              getDescription={getDescription}
              disabled={disabled}
            />
          ) : null}
          {localPermissions.usersWithPermissions
            ? localPermissions.usersWithPermissions.map((theUser: AccountWithPermissions) =>
                !selectedUser || theUser.account.id !== selectedUser.id ? (
                  <AuthorizationComponent
                    key={theUser.account.id}
                    user={theUser.account}
                    updateHandler={updateHandler}
                    preCheckAuthorization={preCheckAuthorization}
                    collapsedByDefault={true}
                    authorizations={Object.values(Permission)}
                    disabled={disabled}
                    getDescription={getDescription}
                    loading={loading}
                  />
                ) : null
              )
            : null}
        </FlexColumnContainer>
      </FlexRowContainer>
    </Panel>
  );
}

function mapStateToProps(state: any) {
  return {
    token: state.token,
    loading: state.apiCallsInProgress > 0,
    localPermissions: state.localPermissions,
    label: state.label,
    users: state.users
  };
}

const mapDispatchToProps = {
  searchUsers,
  clearSearchedUsers,
  getUsersWithPermissions,
  updateUserPermissions
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageLabelPermissions);
