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
import React, { ReactNode, useContext } from "react";
import IPersonalAccount from "../interfaces/IPersonalAccount";
import useToken from "../hooks/useToken";
import DataRequest from "../types/DataRequest";
import useDataApi from "../hooks/useDataApi";
import { customGenericDataFetchReducer } from "./genericDataFetchReducer";
import { LoaderIcon } from "../atoms/Icons";
import styled, { ThemeContext } from "styled-components";
import FlexColumn from "../atoms/FlexColumn";
import { PermissionTypes } from "../types/PermissionType";

export interface IUserProfile {
  personalAccount: IPersonalAccount;
  hasPermission: (permission: PermissionTypes) => boolean;
}

export class UserProfile implements IUserProfile {
  personalAccount: IPersonalAccount;
  constructor(personalAccount: IPersonalAccount) {
    this.personalAccount = personalAccount;
  }

  hasPermission(permission: PermissionTypes): boolean {
    return (
      this.personalAccount &&
      this.personalAccount.roles &&
      this.personalAccount.roles.filter(
        role => role.permissions && role.permissions.indexOf(permission) >= 0
      ).length > 0
    );
  }
}

export const UserProfileContext = React.createContext<IUserProfile>(
  {} as IUserProfile
);

interface IUserProfileStoreProviderProps {
  children: ReactNode;
}

const LoaderContainer = styled(FlexColumn)`
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const UserProfileStoreProvider: React.FC<IUserProfileStoreProviderProps> = ({
  children
}) => {
  interface IProfileApiReponse {
    isLoading: boolean;
    data: IPersonalAccount;
  }

  const [token] = useToken();

  const dataRequest: DataRequest = {
    method: "get",
    token,
    url: "/api/personalaccount/me"
  };

  const [profileApiResponse] = useDataApi<IProfileApiReponse, IPersonalAccount>(
    customGenericDataFetchReducer,
    dataRequest
  );

  const theme = useContext(ThemeContext);

  return (
    <>
      {profileApiResponse.isLoading ? (
        <LoaderContainer>
          <LoaderIcon size={64} color={theme.loaderIcon.color} />
        </LoaderContainer>
      ) : (
        <UserProfileContext.Provider
          value={new UserProfile(profileApiResponse.data)}
        >
          {children}
        </UserProfileContext.Provider>
      )}
    </>
  );
};

export const useUserProfileContextStore = () => useContext(UserProfileContext);
