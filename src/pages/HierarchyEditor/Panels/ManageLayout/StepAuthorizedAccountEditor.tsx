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
  CollectionContainerTitle,
  CollectionContainerCard
} from "../../../../atoms/Collection";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import DataRequest from "../../../../types/DataRequest";
import useDataApi from "../../../../hooks/useDataApi";
import { customGenericDataFetchReducer } from "../../../../stores/genericDataFetchReducer";
import AlternateLoader from "../../../../atoms/Icons/AlternateLoader";
import { PlusIcon } from "../../../../atoms/Icons";
import SearchInput from "../../../../atoms/SearchInput";
import ISearchResult from "../../../../interfaces/ISearchResult";
import { IPublicKey } from "../../../../interfaces/ILayout";
import { Warning } from "../../../../atoms/Alerts";
import { HierarchyEditorStateContext } from "../../../../stores/hierarchyEditorStore";

interface IAccountStatusLabelProps {
  active: boolean;
}

export const AccountStatusLabel = styled.span<IAccountStatusLabelProps>`
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

const ItemTitle = styled(CollectionContainerCard)``;

const RemoveItemButton = styled(BaseActionButton)``;

enum AccountType {
  SERVICE_ACCOUNT = "SERVICE_ACCOUNT",
  PERSONAL_ACCOUNT = "PERSONAL_ACCOUNT"
}

enum KeyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED"
}

interface IKeyStatus {
  accountId: string;
  name: string;
  path: string;
  accountType: AccountType;
  keyId: string;
  keyStatus: KeyStatus;
}

interface IAccountInfo {
  accountId: string;
  name: string;
  path: string;
  accountType: AccountType;
}

interface IKeyStatusApiResponse {
  isLoading: boolean;
  data: Array<IAccountInfo>;
}

interface IAccountSearchResult extends ISearchResult {
  accountType: AccountType;
}

const StepAuthorizedAccountEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();
  const [hierarchyEditorState] = useContext(HierarchyEditorStateContext);

  const theme = useContext(ThemeContext);

  const [authorizedPersonalAccounts, setAuthorizedPersonalAccounts] = useState<
    Array<IKeyStatus>
  >([]);

  const [addAccountMode, setAddAccountMode] = useState(false);

  const [noKeyMessage, setNoKeyMessage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    setNoKeyMessage(undefined);
  }, [addAccountMode]);

  const [searchAccountApiResponse, setSearchAccountApiRequest] = useDataApi<
    IKeyStatusApiResponse,
    Array<IKeyStatus>
  >(customGenericDataFetchReducer);

  const getAccountWithKeyId = (keyIds: Array<string>) => {
    const activeKeyIdsRequest: DataRequest = {
      method: "get",
      params: { keyIds: keyIds.join(",") },
      cbSuccess: (activeUsers: Array<IKeyStatus>) => {
        setAuthorizedPersonalAccounts(activeUsers);
      },
      url: `/api/supplychain/${hierarchyEditorState.editor.node.referenceId}/account/key`
    };
    setSearchAccountApiRequest(activeKeyIdsRequest);
  };

  useEffect(() => {
    if (
      editorStoreContext.state.selectedLayoutElement &&
      editorStoreContext.state.selectedLayoutElement.step &&
      editorStoreContext.state.selectedLayoutElement.step.authorizedKeyIds
    ) {
      getAccountWithKeyId(
        editorStoreContext.state.selectedLayoutElement.step.authorizedKeyIds
      );
    } else {
      setAuthorizedPersonalAccounts([]);
    }
    setAddAccountMode(false);
  }, [editorStoreContext.state.selectedLayoutElement?.step?.authorizedKeyIds]);

  const deleteKey = (keyId: string) => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_STEP_AUTHORIZED_KEY,
      publicKey: {
        keyId: keyId
      } as IPublicKey
    });
  };

  const collectorRow = (keyStatus: IKeyStatus, index: number) => {
    return (
      <ItemTitle clickable={false}>
        <CollectionContainerSpan>
          {keyStatus.keyStatus === KeyStatus.ACTIVE ? (
            <AccountStatusLabel active={true}>active key</AccountStatusLabel>
          ) : (
            <AccountStatusLabel active={false}>
              {keyStatus.keyStatus === KeyStatus.INACTIVE
                ? "inactive key"
                : "deleted"}
            </AccountStatusLabel>
          )}
          {keyStatus.accountType === AccountType.SERVICE_ACCOUNT
            ? keyStatus.path + "/"
            : ""}
          {keyStatus.name}
        </CollectionContainerSpan>
        <ActionIconsContainer>
          <RemoveItemButton
            data-testhook-id={"delete-key-" + index}
            onClick={() => deleteKey(keyStatus.keyId)}>
            <RemoveIcon size={24} color={theme.layoutBuilder.iconColor} />
          </RemoveItemButton>
        </ActionIconsContainer>
      </ItemTitle>
    );
  };

  const parseSearchInputResults = (
    apiResponse: IKeyStatusApiResponse
  ): Array<ISearchResult> => {
    if (apiResponse.data && apiResponse.data.length > 0) {
      return apiResponse.data.map(
        entry =>
          ({
            id: entry.accountId,
            displayLabel:
              (entry.accountType === AccountType.SERVICE_ACCOUNT
                ? entry.path + "/"
                : "") + entry.name,
            accountType: entry.accountType
          } as IAccountSearchResult)
      );
    }

    return [];
  };

  const onAddAccount = (searchResult: IAccountSearchResult) => {
    setAddAccountMode(false);
    const getUserRequest: DataRequest = {
      method: "get",
      url: `/api/${
        searchResult.accountType === AccountType.PERSONAL_ACCOUNT
          ? "personalaccount"
          : "serviceaccount"
      }/${searchResult.id}/key`,
      cbSuccess: (key: any) => {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.ADD_STEP_AUTHORIZED_KEY,
          publicKey:
            searchResult.accountType === AccountType.PERSONAL_ACCOUNT
              ? key
              : { keyId: key.keyId, publicKey: key.publicKey }
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
        onSelect={selected => onAddAccount(selected as IAccountSearchResult)}
        onCancel={() => setAddAccountMode(false)}
        fetchData={searchQuery => {
          const searchUserRequest: DataRequest = {
            method: "get",
            params: {
              name: searchQuery
            },
            url: `/api/supplychain/${hierarchyEditorState.editor.node.referenceId}/account`
          };
          setSearchAccountApiRequest(searchUserRequest);
        }}
        isLoading={searchAccountApiResponse.isLoading}
        defaultLabel={"Search account"}
        onSelectLabel={"Selected account"}
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
            data-testhook-id={"add-key"}
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
              <li key={"key-row-" + index}>{collectorRow(account, index)}</li>
            );
          })}
        </CollectionContainerList>
      </ItemContainer>
    </>
  );
};

export default StepAuthorizedAccountEditor;
