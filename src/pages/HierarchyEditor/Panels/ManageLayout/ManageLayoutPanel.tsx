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
import ContentSeparator from "../../../../atoms/ContentSeparator";

import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";

import { ILayout, ILayoutMetaBlock } from "../../../../interfaces/ILayout";

import { NoCryptoWarning } from "../../../../molecules/NoCryptoWarning";
import { Panel } from "../../../../molecules/Panel";
import { cryptoAvailable } from "../../../../security";
import DataRequest from "../../../../types/DataRequest";
import SegmentsContainer from "../../../../molecules/SegmentsContainer";
import {
  createLayoutEditorStoreContext,
  LayoutEditorActionType,
  LayoutEditorStoreContext
} from "../../../../stores/LayoutEditorStore";
import LayoutJsonEditor from "./LayoutJsonEditor";
import LayoutSigner from "./LayoutSigner";
import LayoutEditorDetailsPane from "./LayoutEditorDetailsPane";
import styled from "styled-components";
import { IApprovalConfig } from "../../../../interfaces/IApprovalConfig";
import { HierarchyEditorStateContext } from "../../../../stores/hierarchyEditorStore";
import PanelBreadCrumb from "../../../../molecules/PanelBreadCrumb";
import Layout from "../../../../atoms/Layout";
import JsonSignAndSubmit from "./JsonSignAndSubmit";
import { WarningContainer } from "../../../../atoms/Alerts";
import { IReleaseConfig } from "../../../../interfaces/IReleaseConfig";

const PageSpecificContentSeparator = styled(ContentSeparator)`
  margin: 0.7rem 0 1rem;
`;

const NoCryptoWarningContainer = styled.div`
  ${WarningContainer} {
    margin-top: 0;
  }
`;

const ManageLayoutPanel: React.FC = () => {
  const editorStoreContext = createLayoutEditorStoreContext();

  const [layoutApiResponse, setLayoutApiRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [hierarchyEditorState] = useContext(HierarchyEditorStateContext);

  const [
    _approvalConfigsApiResponse,
    setApprovalConfigsApiRequest
  ] = useDataApi(genericDataFetchReducer);

  const [_releaseConfigApiResponse, setReleaseConfigApiRequest] = useDataApi(
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
      url:
        "/api/supplychain/" +
        hierarchyEditorState.editor.node.referenceId +
        "/layout",
      cbSuccess: (layoutMetaBlock: ILayoutMetaBlock) => {
        setLayout(layoutMetaBlock.layout);
      },
      cbFailure: (error): boolean => {
        return error.response && error.response.status === 404;
      }
    };
    setLayoutApiRequest(getLayoutRequest);

    const getGetApprovalConfigsRequest: DataRequest = {
      method: "get",
      url:
        "/api/supplychain/" +
        hierarchyEditorState.editor.node.referenceId +
        "/layout/approvalconfig",
      cbSuccess: (approvalConfigs: Array<IApprovalConfig>) => {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.UPDATE_APPROVAL_CONFIGS,
          approvalConfigs: approvalConfigs
        });
      },
      cbFailure: (): boolean => {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.UPDATE_APPROVAL_CONFIGS,
          approvalConfigs: []
        });
        return false;
      }
    };
    setApprovalConfigsApiRequest(getGetApprovalConfigsRequest);

    const getGetReleaseConfigRequest: DataRequest = {
      method: "get",
      url:
        "/api/supplychain/" +
        hierarchyEditorState.editor.node.referenceId +
        "/layout/releaseconfig",
      cbSuccess: (releaseConfig: IReleaseConfig) => {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.UPDATE_RELEASE_CONFIG,
          releaseConfig
        });
      },
      cbFailure: (error: any): boolean => {
        if (error.response && error.response.status === 404) {
          editorStoreContext.dispatch({
            type: LayoutEditorActionType.UPDATE_RELEASE_CONFIG,
            releaseConfig: {
              artifactCollectorSpecifications: []
            }
          });
          return true;
        }
        return false;
      }
    };
    setReleaseConfigApiRequest(getGetReleaseConfigRequest);
  }, [hierarchyEditorState.editor.node.referenceId]);

  return (
    <>
      <LayoutEditorStoreContext.Provider value={editorStoreContext}>
        <Panel width={"37.5vw"} resizable={true} title={"Manage layout"}>
          <PanelBreadCrumb
            node={hierarchyEditorState.editor.node}
            breadcrumb={hierarchyEditorState.editor.breadcrumb}
          />
          {!cryptoAvailable() ? (
            <NoCryptoWarningContainer>
              <NoCryptoWarning />
            </NoCryptoWarningContainer>
          ) : null}
          <Layout />
          <LayoutJsonEditor />
          <SegmentsContainer />
          <PageSpecificContentSeparator />
          {cryptoAvailable() ? <JsonSignAndSubmit /> : null}
          <LayoutSigner />
        </Panel>
        <LayoutEditorDetailsPane />
      </LayoutEditorStoreContext.Provider>
    </>
  );
};

export default ManageLayoutPanel;
