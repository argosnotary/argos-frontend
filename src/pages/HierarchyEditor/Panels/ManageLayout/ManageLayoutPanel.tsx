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
import React, { useContext, useEffect } from "react";
import { LastBreadCrumb, NodesBreadCrumb } from "../../../../atoms/Breadcrumbs";
import ContentSeparator from "../../../../atoms/ContentSeparator";

import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";

import { ILayout, ILayoutMetaBlock } from "../../../../interfaces/ILayout";

import { NoCryptoWarning } from "../../../../molecules/NoCryptoWarning";
import { Panel } from "../../../../molecules/Panel";
import { cryptoAvailable } from "../../../../security";
import useToken from "../../../../hooks/useToken";
import DataRequest from "../../../../types/DataRequest";
import LayoutEditor from "./LayoutEditor";
import {
  createLayoutEditorStoreContext,
  LayoutEditorActionType,
  LayoutEditorStoreContext
} from "./LayoutEditorStore";
import LayoutJsonEditor from "./LayoutJsonEditor";
import LayoutSigner from "./LayoutSigner";
import LayoutEditorDetailsPane from "./LayoutEditorDetailsPane";
import { StateContext } from "../../HierarchyEditor";

const ManageLayoutPanel: React.FC = () => {
  const [state, _dispatch] = useContext(StateContext);

  const editorStoreContext = createLayoutEditorStoreContext();

  const [token] = useToken();

  const [layoutApiResponse, setLayoutApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  useEffect(() => {
    editorStoreContext.dispatch({
      type: layoutApiResponse.isLoading
        ? LayoutEditorActionType.START_LOADING
        : LayoutEditorActionType.END_LOADING
    });
  }, [layoutApiResponse.isLoading]);

  const setLayout = (layout: ILayout) => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.UPDATE_LAYOUT,
      layout: layout
    });
  };

  useEffect(() => {
    setLayout({} as ILayout);
    const getLayoutRequest: DataRequest = {
      method: "get",
      token,
      url: "/api/supplychain/" + state.nodeReferenceId + "/layout",
      cbSuccess: (layoutMetaBlock: ILayoutMetaBlock) => {
        setLayout(layoutMetaBlock.layout);
      },
      cbFailure: (error): boolean => {
        return error.response && error.response.status === 404;
      }
    };
    setLayoutApiRequest(getLayoutRequest);
  }, [state.nodeReferenceId]);

  return (
    <>
      <LayoutEditorStoreContext.Provider value={editorStoreContext}>
        <Panel width={"37.5vw"} resizable={true} title={"Manage layout"}>
          {state.selectedNodeName !== "" ? (
            <>
              <NodesBreadCrumb>
                Selected: {state.breadcrumb}
                <LastBreadCrumb>
                  {state.breadcrumb.length > 0 ? " / " : ""}
                  {state.selectedNodeName}
                </LastBreadCrumb>
              </NodesBreadCrumb>
              <ContentSeparator />
            </>
          ) : null}
          <LayoutEditor />
          <LayoutJsonEditor />
          <LayoutSigner />
          {!cryptoAvailable() ? <NoCryptoWarning /> : null}
        </Panel>
        <LayoutEditorDetailsPane />
      </LayoutEditorStoreContext.Provider>
    </>
  );
};

export default ManageLayoutPanel;
