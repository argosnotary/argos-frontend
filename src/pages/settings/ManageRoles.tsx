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
import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";

import SearchInput from "../../organisms/SearchInput";
import { FlexRowContainer, FlexColumnContainer } from "../../atoms/Flex";
import { Permission, PersonalAccount, Role } from "../../api";
import { getUsersWithRole, updateUserRoles, setSelectedUser } from "./roleSlice";
import { searchUsers, clearSearchedUsers } from "../common/usersSlice";
import AuthorizationComponent from "../../organisms/AuthorizationComponent";
import { Panel } from "../../organisms/Panel";

function ManageRoles(props: any): React.ReactElement {
  const {
    profile,
    searchUsers,
    setSelectedUser,
    getUsersWithRole,
    updateUserRoles,
    clearSearchedUsers,
    loading,
    role
  } = props;

  useEffect(() => {
    getUsersWithRole();
    setSelectedUser(undefined);
    clearSearchedUsers();
  }, []);

  function updateHandler(user: PersonalAccount, theRole: any, checked: boolean) {
    let userRoles: Role[] | undefined = [];
    if (checked) {
      if (!user.roles) {
        userRoles = [theRole];
      } else {
        if (user.roles.filter(aRole => aRole === theRole).length === 0) {
          userRoles = [...user.roles, theRole];
        }
      }
    } else {
      userRoles = user.roles ? user.roles.filter(aRole => aRole !== theRole) : [];
    }

    if (role.selectedUser && role.selectedUser.id === user.id) {
      setSelectedUser({ ...user, roles: userRoles });
    }

    updateUserRoles({ ...user, roles: userRoles });
  }
  const dispatch = useDispatch();

  function selectHandler(selectedSearchResult: any) {
    if (selectedSearchResult) {
      setSelectedUser(selectedSearchResult);
    }
    dispatch(clearSearchedUsers());
  }

  const sameUserDisabled = (currentUserId: string, userId: string): boolean => {
    return currentUserId === userId;
  };

  const preCheckAuthorization = (permission: Role | Permission, user: PersonalAccount): boolean => {
    return user.roles && user.roles.length > 0
      ? user.roles.findIndex((entry: Role) => entry === permission) > -1
      : false;
  };

  const getDescription = (role: Role | Permission): string => {
    return role.toLocaleLowerCase();
  };

  return (
    <Panel title={"Manage roles"}>
      <FlexRowContainer>
        <FlexColumnContainer>
          <SearchInput
            entries={role.searchedUsers}
            onSelect={selectHandler}
            onCancel={() => setSelectedUser(undefined)}
            fetchData={searchQuery => searchUsers(searchQuery)}
            loading={loading}
            defaultLabel={"Search user"}
            onSelectLabel={"Selected user"}
            placeHolder={"Name"}
          />
          {role.selectedUser ? (
            <AuthorizationComponent
              key={role.selectedUser.id}
              user={role.selectedUser}
              disabled={sameUserDisabled(profile.id, role.selectedUser.id ? role.selectedUser.id : "")}
              collapsedByDefault={false}
              updateHandler={updateHandler}
              preCheckAuthorization={preCheckAuthorization}
              authorizations={Object.values(Role)}
              getDescription={getDescription}
              loading={loading}
            />
          ) : null}
          {role.usersWithRole
            ? role.usersWithRole.map((theUser: PersonalAccount) =>
                role.selectedUser && role.selectedUser.id === theUser.id ? null : (
                  <AuthorizationComponent
                    key={theUser.id}
                    user={theUser}
                    disabled={sameUserDisabled(profile.id, theUser.id ? theUser.id : "")}
                    updateHandler={updateHandler}
                    collapsedByDefault={true}
                    preCheckAuthorization={preCheckAuthorization}
                    authorizations={Object.values(Role)}
                    getDescription={getDescription}
                    loading={loading}
                  />
                )
              )
            : null}
        </FlexColumnContainer>
      </FlexRowContainer>
    </Panel>
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
  searchUsers,
  setSelectedUser,
  clearSearchedUsers,
  getUsersWithRole,
  updateUserRoles
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageRoles);
