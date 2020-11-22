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
import React, {
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";
import IPersonalAccount from "../interfaces/IPersonalAccount";
import { createRequestConfig } from "../hooks/useDataApi";
import { LoaderIcon } from "../atoms/Icons";
import styled, { ThemeContext } from "styled-components";
import FlexColumn from "../atoms/FlexColumn";
import { PermissionTypes } from "../types/PermissionType";
import { ConnectionErrorMessage } from "../atoms/ConnectionError";
import axios, { CancelTokenSource } from "axios";
import { useHistory } from "react-router-dom";

export enum PROFILE_STATE {
  LOADING,
  READY,
  LOGGED_OUT
}

export enum TokenActionType {
  LOGIN,
  REFRESH,
  LOGOUT
}

export interface ITokenAction {
  type: TokenActionType;
  token: string | null;
}

export interface IUserProfileContext {
  state: PROFILE_STATE;
  profile?: IUserProfile;
  setUserProfile: Dispatch<IUserProfile>;
  token: string;
  doTokenAction: Dispatch<ITokenAction>;
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
  doTokenAction: () => {
    return;
  },
  setError: () => {
    return;
  },
  state: PROFILE_STATE.LOADING,
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
  const [tokenAction, setTokenAction] = useState<ITokenAction>({
    token: localStorage.getItem("token"),
    type: localStorage.getItem("token")
      ? TokenActionType.LOGIN
      : TokenActionType.LOGOUT
  });
  const [token, setToken] = useState<string>("");
  const [state, setState] = useState<PROFILE_STATE>(PROFILE_STATE.LOADING);
  const [error, setError] = useState<string | null>();

  const history = useHistory();

  const handleLogin = (source: CancelTokenSource) => {
    if (tokenAction.token) {
      setState(PROFILE_STATE.LOADING);
      localStorage.setItem("token", tokenAction.token);
      setToken(tokenAction.token);

      const requestConfig = createRequestConfig(tokenAction.token, source);
      requestConfig.method = "get";
      axios("/api/personalaccount/me", requestConfig)
        .then(response => {
          setUserProfile(new UserProfile(response.data));
          setState(PROFILE_STATE.READY);
          history.push("/dashboard");
        })
        .catch(error => {
          if (!axios.isCancel(error)) {
            setTokenAction({ token: null, type: TokenActionType.LOGOUT });
          }
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserProfile(undefined);
    setState(PROFILE_STATE.LOGGED_OUT);
    history.push("/login");
  };

  const handleRefresh = () => {
    if (tokenAction.token) {
      localStorage.setItem("token", tokenAction.token);
      setToken(tokenAction.token);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    switch (tokenAction.type) {
      case TokenActionType.LOGIN:
        handleLogin(source);
        break;
      case TokenActionType.LOGOUT:
        handleLogout();
        break;
      case TokenActionType.REFRESH:
        handleRefresh();
        break;
    }

    return () => {
      source.cancel();
    };
  }, [tokenAction]);

  const theme = useContext(ThemeContext);
  return (
    <>
      {error ? <ConnectionErrorMessage>{error}</ConnectionErrorMessage> : null}
      {state === PROFILE_STATE.LOADING ? (
        <LoaderContainer>
          <LoaderIcon size={64} color={theme.loaderIcon.color} />
        </LoaderContainer>
      ) : null}
      <UserProfileContext.Provider
        value={{
          profile: userProfile,
          setUserProfile,
          token,
          doTokenAction: setTokenAction,
          state,
          setError
        }}>
        {children}
      </UserProfileContext.Provider>
    </>
  );
};

export const useUserProfileContext = () => useContext(UserProfileContext);
