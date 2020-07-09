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
import styled, { ThemeContext } from "styled-components";
import {
  ActionIconsContainer,
  BaseActionButton,
  CollectionContainer,
  CollectionContainerButton,
  CollectionContainerList,
  CollectionContainerRow,
  CollectionContainerSpan,
  CollectionContainerTitle
} from "../../../../atoms/Collection";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import DataRequest from "../../../../types/DataRequest";
import { useUserProfileContext } from "../../../../stores/UserProfile";
import useDataApi from "../../../../hooks/useDataApi";
import { customGenericDataFetchReducer } from "../../../../stores/genericDataFetchReducer";
import AlternateLoader from "../../../../atoms/Icons/AlternateLoader";
import { PlusIcon } from "../../../../atoms/Icons";
import SearchInput from "../../../../atoms/SearchInput";
import ISearchResult from "../../../../interfaces/ISearchResult";
import { IPublicKey } from "../../../../interfaces/ILayout";
import { Warning } from "../../../../atoms/Alerts";

interface IAccountStatusLabelProps {
  active: boolean;
}

const AccountStatusLabel = styled.span<IAccountStatusLabelProps>`
  color: ${props =>
    props.active ? props.theme.labels.active : props.theme.labels.inactive};
  padding: 0 0.5rem;
  border: 2px solid
    ${props =>
      props.active ? props.theme.labels.active : props.theme.labels.inactive};
  margin: 0 0.5rem 0 0;
  font-size: 0.9rem;
`;

const ItemContainer = styled(CollectionContainer)``;

const ItemContainerTitle = styled(CollectionContainerTitle)``;

const AddItemButton = styled(CollectionContainerButton)``;

const ItemTitle = styled.header`
  border: 1px solid transparent;
  box-sizing: border-box;
  padding: 0.5rem;
  width: 100%;
  margin: 0.2rem 0 0;
  background-color: ${props => props.theme.layoutBuilder.segmentTitleBgColor};

  display: flex;
  align-items: center;
  justify-content: space-between;

  > span {
    margin: 0 0.5rem;
  }
`;

const ItemContainerSection = styled.section`
  width: 100%;
  margin: 0 0 1rem;
`;

const RemoveItemButton = styled(BaseActionButton)``;

interface ISearchApiUser {
  id: string;
  name: string;
}

interface IAuthorizedAccount {
  id: string;
  name: string;
  keyId: string;
  active: boolean;
}

interface IAccountSearchApiResponse {
  isLoading: boolean;
  data: Array<ISearchApiUser>;
}

const LayoutAuthorizedAccountEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const [authorizedPersonalAccounts, setAuthorizedPersonalAccounts] = useState<
    Array<IAuthorizedAccount>
  >([]);

  const [addAccountMode, setAddAccountMode] = useState(false);

  const [noKeyMessage, setNoKeyMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setNoKeyMessage(undefined);
  }, [addAccountMode]);

  const [searchAccountApiResponse, setSearchAccountApiRequest] = useDataApi<
    IAccountSearchApiResponse,
    Array<ISearchApiUser>
  >(customGenericDataFetchReducer);

  const { token } = useUserProfileContext();

  const getAccountWithKeyId = (
    accounts: Array<IAuthorizedAccount>,
    index: number
  ) => {
    const keyId = editorStoreContext.state.layout.authorizedKeyIds[index];
    if (keyId) {
      const activeKeyIdsRequest: DataRequest = {
        method: "get",
        params: { activeKeyIds: keyId },
        cbSuccess: (activeUsers: Array<ISearchApiUser>) => {
          if (activeUsers.length > 0) {
            accounts.push({ ...activeUsers[0], active: true, keyId });
            getAccountWithKeyId(accounts, index + 1);
          } else {
            const inactiveKeyIdsRequest: DataRequest = {
              method: "get",
              params: { inactiveKeyIds: keyId },
              cbSuccess: (inactiveUsers: Array<ISearchApiUser>) => {
                if (inactiveUsers.length > 0) {
                  accounts.push({ ...inactiveUsers[0], active: false, keyId });
                  getAccountWithKeyId(accounts, index + 1);
                }
              },
              token,
              url: `/api/personalaccount`
            };
            setSearchAccountApiRequest(inactiveKeyIdsRequest);
          }
        },
        token,
        url: `/api/personalaccount`
      };
      setSearchAccountApiRequest(activeKeyIdsRequest);
    } else {
      setAuthorizedPersonalAccounts(accounts);
    }
  };

  useEffect(() => {
    if (
      editorStoreContext.state.layout.authorizedKeyIds &&
      editorStoreContext.state.layout.authorizedKeyIds.length > 0
    ) {
      getAccountWithKeyId([], 0);
    } else {
      setAuthorizedPersonalAccounts([]);
    }
    setAddAccountMode(false);
  }, [editorStoreContext.state.layout.authorizedKeyIds]);

  const deleteCollector = (keyId: string) => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_LAYOUT_AUTHORIZED_KEY,
      publicKey: {
        id: keyId
      } as IPublicKey
    });
  };

  const collectorRow = (account: IAuthorizedAccount, index: number) => {
    return (
      <ItemContainerSection>
        <ItemTitle>
          <CollectionContainerSpan>
            {account.active ? (
              <AccountStatusLabel active={true}>active key</AccountStatusLabel>
            ) : (
              <AccountStatusLabel active={false}>
                inactive key
              </AccountStatusLabel>
            )}
            {account.name}
          </CollectionContainerSpan>
          <ActionIconsContainer>
            <RemoveItemButton
              data-testhook-id={"delete-item-" + index}
              onClick={() => deleteCollector(account.keyId)}>
              <RemoveIcon size={24} color={theme.layoutBuilder.iconColor} />
            </RemoveItemButton>
          </ActionIconsContainer>
        </ItemTitle>
      </ItemContainerSection>
    );
  };

  const parseSearchInputResults = (
    apiResponse: IAccountSearchApiResponse
  ): Array<ISearchResult> => {
    if (apiResponse.data && apiResponse.data.length > 0) {
      return apiResponse.data.map(
        entry =>
          ({
            id: entry.id,
            displayLabel: entry.name
          } as ISearchResult)
      );
    }

    return [];
  };

  const onAddAccount = (searchResult: ISearchResult) => {
    setAddAccountMode(false);
    const getUserRequest: DataRequest = {
      method: "get",
      token,
      url: `/api/personalaccount/${searchResult.id}/key`,
      cbSuccess: (key: IPublicKey) => {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.ADD_LAYOUT_AUTHORIZED_KEY,
          publicKey: key
        });
      },
      cbFailure: error => {
        if (error.response && error.response.status === 404) {
          setNoKeyMessage(`${searchResult.displayLabel} has no active key`);
          return true;
        }
        return false;
      }
    };
    setSearchAccountApiRequest(getUserRequest);
  };

  const addAccount = () => {
    return (
      <SearchInput
        results={parseSearchInputResults(searchAccountApiResponse)}
        onSelect={onAddAccount}
        onCancel={() => setAddAccountMode(false)}
        fetchData={searchQuery => {
          const searchUserRequest: DataRequest = {
            method: "get",
            params: {
              name: searchQuery
            },
            token,
            url: `/api/personalaccount`
          };
          setSearchAccountApiRequest(searchUserRequest);
        }}
        isLoading={searchAccountApiResponse.isLoading}
        defaultLabel={"Search user"}
        onSelectLabel={"Selected user"}
        placeHolder={"Name"}
      />
    );
  };

  return (
    <>
      <ItemContainer>
        <CollectionContainerRow>
          <ItemContainerTitle>Authorized Accounts</ItemContainerTitle>
          <AddItemButton
            data-testhook-id={"add-item"}
            onClick={() => setAddAccountMode(true)}>
            <PlusIcon size={24} color={theme.layoutBuilder.iconColor} />
          </AddItemButton>
        </CollectionContainerRow>
        <CollectionContainerList>
          {addAccountMode ? addAccount() : null}
          {noKeyMessage ? <Warning message={noKeyMessage} /> : null}
          {!addAccountMode && searchAccountApiResponse.isLoading ? (
            <AlternateLoader size={32} color={theme.alternateLoader.color} />
          ) : null}
          {authorizedPersonalAccounts.map((account, index) => {
            return (
              <li key={"item-row-" + index}>{collectorRow(account, index)}</li>
            );
          })}
        </CollectionContainerList>
      </ItemContainer>
    </>
  );
};

export default LayoutAuthorizedAccountEditor;
