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

const CollectorsContainer = styled(CollectionContainer)`
  min-height: 0;
  flex-direction: column;
  border: 0;
  padding: 0 1rem 1rem;
  border: 1px solid
    ${props => props.theme.layoutBuilder.segmentContainerBorderColor};
`;

const CollectorsContainerTitle = styled(CollectionContainerTitle)`
  font-size: 0.85rem;
  top: -1rem;
  color: ${props => props.theme.layoutBuilder.segmentsContainerTitleColor};
  background-color: ${props =>
    props.theme.layoutBuilder.segmentContainerTitleBgColor};
  padding: 0.25rem 2rem 0.4rem;
`;

const AddCollectorButton = styled(CollectionContainerButton)`
  right: 0;

  &:hover {
    cursor: pointer;
    transform: scale(0.8);
  }
`;

const CollectorTitle = styled.header`
  border: 1px solid transparent;
  box-sizing: border-box;
  padding: 0.5rem;
  width: 100%;
  margin: 0.2rem 0 0;
  background-color: ${props => props.theme.layoutBuilder.segmentTitleBgColor};

  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    margin: 0 0.5rem;
  }
`;

const CollectorContainerSection = styled.section`
  width: 100%;
  margin: 0 0 1rem;
`;

const RemoveCollectorButton = styled(BaseActionButton)``;

interface ISearchApiUser {
  id: string;
  name: string;
}

interface IAuthorizedAccount {
  id: string;
  name: string;
  active: boolean;
}

interface IAccountSearchApiResponse {
  isLoading: boolean;
  data: Array<ISearchApiUser>;
}

const LayoutDetailsEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const [authorizedPersonalAccounts, setAuthorizedPersonalAccounts] = useState<
    Array<IAuthorizedAccount>
  >([]);

  const [addAccountMode, setAddAccountMode] = useState(false);

  const [searchAccountApiResponse, setSearchAccountApiRequest] = useDataApi<
    IAccountSearchApiResponse,
    Array<ISearchApiUser>
  >(customGenericDataFetchReducer);

  const { token } = useUserProfileContext();

  useEffect(() => {
    if (
      editorStoreContext.state.layout.authorizedKeyIds &&
      editorStoreContext.state.layout.authorizedKeyIds.length > 0
    ) {
      const activeKeyIdsRequest: DataRequest = {
        method: "get",
        params: {
          activeKeyIds: editorStoreContext.state.layout.authorizedKeyIds.join(
            ","
          )
        },
        cbSuccess: (activeUsers: Array<ISearchApiUser>) => {
          const inactiveKeyIdsRequest: DataRequest = {
            method: "get",
            params: {
              inactiveKeyIds: editorStoreContext.state.layout.authorizedKeyIds.join(
                ","
              )
            },
            cbSuccess: (inactiveUsers: Array<ISearchApiUser>) => {
              setAuthorizedPersonalAccounts(
                activeUsers
                  .map(user => ({ ...user, active: true }))
                  .concat(
                    inactiveUsers.map(user => ({ ...user, active: false }))
                  )
              );
            },
            token,
            url: `/api/personalaccount`
          };
          setSearchAccountApiRequest(inactiveKeyIdsRequest);
        },
        token,
        url: `/api/personalaccount`
      };

      setSearchAccountApiRequest(activeKeyIdsRequest);
    } else {
      setAuthorizedPersonalAccounts([]);
    }
    setAddAccountMode(false);
  }, [editorStoreContext.state.layout]);

  const deleteCollector = (index: number) => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_LAYOUT_AUTHORIZED_KEY,
      publicKey: {
        id: editorStoreContext.state.layout.authorizedKeyIds[index]
      } as IPublicKey
    });
  };

  const collectorRow = (account: IAuthorizedAccount, index: number) => {
    return (
      <CollectorContainerSection>
        <CollectorTitle>
          <CollectionContainerSpan>
            {account.name} {account.active ? <>active</> : <>inactive</>}
          </CollectionContainerSpan>
          <ActionIconsContainer>
            <RemoveCollectorButton
              data-testhook-id={"delete-collector-" + index}
              onClick={() => deleteCollector(index)}>
              <RemoveIcon size={24} color={theme.layoutBuilder.iconColor} />
            </RemoveCollectorButton>
          </ActionIconsContainer>
        </CollectorTitle>
      </CollectorContainerSection>
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
      />
    );
  };

  return (
    <>
      <CollectorsContainer>
        <CollectionContainerRow>
          <CollectorsContainerTitle>
            Authorized Personal Accounts
          </CollectorsContainerTitle>
          <AddCollectorButton
            data-testhook-id={"add-collector"}
            onClick={() => setAddAccountMode(true)}>
            <PlusIcon size={24} color={theme.layoutBuilder.iconColor} />
          </AddCollectorButton>
        </CollectionContainerRow>
        <CollectionContainerList>
          {addAccountMode ? addAccount() : null}
          {!addAccountMode && searchAccountApiResponse.isLoading ? (
            <AlternateLoader size={32} color={theme.alternateLoader.color} />
          ) : null}
          {authorizedPersonalAccounts.map((account, index) => {
            return (
              <li key={"collector-row-" + index}>
                {collectorRow(account, index)}
              </li>
            );
          })}
        </CollectionContainerList>
      </CollectorsContainer>
    </>
  );
};

export default LayoutDetailsEditor;
