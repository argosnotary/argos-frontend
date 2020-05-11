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
import React, {
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import IPersonalAccount from "../interfaces/IPersonalAccount";
import DataRequest from "../types/DataRequest";
import useDataApi from "../hooks/useDataApi";
import { customGenericDataFetchReducer } from "./genericDataFetchReducer";
import { LoaderIcon } from "../atoms/Icons";
import styled, { ThemeContext } from "styled-components";
import FlexColumn from "../atoms/FlexColumn";
import { PermissionTypes } from "../types/PermissionType";
import { ConnectionErrorMessage } from "../atoms/ConnectionError";

export enum PROFILE_STATE {
  LOADING,
  READY,
  LOGGED_OUT
}

export interface IUserProfileContext {
  state: PROFILE_STATE;
  profile?: IUserProfile;
  setUserProfile: Dispatch<IUserProfile>;
  token: string;
  setToken: Dispatch<string>;
  setError: Dispatch<string | null>;
}

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

export const UserProfileContext = React.createContext<IUserProfileContext>({
  setUserProfile: () => {
    return;
  },
  setToken: () => {
    return;
  },
  setError: () => {
    return;
  },
  state: PROFILE_STATE.LOGGED_OUT,
  token: ""
});

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
  const [userProfile, setUserProfile] = useState<IUserProfile | undefined>();
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );
  const [state, setState] = useState<PROFILE_STATE>(PROFILE_STATE.LOADING);
  const [error, setError] = useState<string | null>();
  interface IProfileApiResponse {
    isLoading: boolean;
    data: IPersonalAccount;
  }

  const [userProfileResponse, setGetUserProfileRequest] = useDataApi<
    IProfileApiResponse,
    IPersonalAccount
  >(customGenericDataFetchReducer);

  useEffect(() => {
    if (token && token.length > 0) {
      setState(PROFILE_STATE.LOADING);
      localStorage.setItem("token", token);
      const dataRequest: DataRequest = {
        method: "get",
        token,
        url: "/api/personalaccount/me"
      };
      setGetUserProfileRequest(dataRequest);
    } else {
      localStorage.removeItem("token");
      setUserProfile(undefined);
      setState(PROFILE_STATE.LOGGED_OUT);
    }
  }, [token]);

  useEffect(() => {
    setUserProfile(new UserProfile(userProfileResponse.data));
    setState(PROFILE_STATE.READY);
  }, [userProfileResponse]);

  const theme = useContext(ThemeContext);

  if (userProfileResponse.isLoading) {
    return (
      <LoaderContainer>
        <LoaderIcon size={64} color={theme.loaderIcon.color} />
      </LoaderContainer>
    );
  } else {
    return (
      <>
        {error ? (
          <ConnectionErrorMessage>{error}</ConnectionErrorMessage>
        ) : null}
        <UserProfileContext.Provider
          value={{
            profile: userProfile,
            setUserProfile,
            token,
            setToken,
            state,
            setError
          }}
        >
          {children}
        </UserProfileContext.Provider>
      </>
    );
  }
};

export const useUserProfileContext = () => useContext(UserProfileContext);
