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
import React, { useContext } from "react";
import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import {
  StateContext,
  LayoutEditorDataActionTypes
} from "../../../stores/layoutEditorStore";
import ContentSeparator from "../../../atoms/ContentSeparator";
import ISearchResult from "../../../interfaces/ISearchResult";
import SearchInput from "../../../atoms/SearchInput";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import DataRequest from "../../../types/DataRequest";
import useToken from "../../../hooks/useToken";
import CollapsibleContainerComponent from "../../../atoms/CollapsibleContainer";

const ManageLabelPermissions = () => {
  const [state, dispatch] = useContext(StateContext);
  const [serverResponse, setServerRequest] = useDataApi(
    genericDataFetchReducer
  );
  const [localStorageToken] = useToken();

  return (
    <div>
      <NodesBreadCrumb>
        Selected: {state.breadcrumb}
        <LastBreadCrumb>
          {state.breadcrumb.length > 0 ? " / " : ""}
          {state.selectedNodeName}
        </LastBreadCrumb>
      </NodesBreadCrumb>
      <ContentSeparator />
      <SearchInput
        results={serverResponse.data}
        onSelect={(selectedSearchResult: ISearchResult) => {
          dispatch({
            type: LayoutEditorDataActionTypes.STORE_SEARCHED_USER,
            user: selectedSearchResult
          });
        }}
        fetchData={(searchQuery: string) => {
          const dataRequest: DataRequest = {
            method: "get",
            params: {
              name: searchQuery
            },
            token: localStorageToken,
            url: `/api/personalaccount`
          };

          setServerRequest(dataRequest);
        }}
        isLoading={serverResponse.isLoading}
        displayProperty={"name"}
      />
      <ContentSeparator />
      <CollapsibleContainerComponent collapsedByDefault={true}>
        <p>...</p>
      </CollapsibleContainerComponent>
    </div>
  );
};

export default ManageLabelPermissions;
