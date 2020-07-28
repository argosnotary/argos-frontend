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
import React, { useEffect, useContext, useState } from "react";
import { Panel } from "../../../../molecules/Panel";
import DataRequest from "../../../../types/DataRequest";
import {
  HierarchyEditorStateContext,
  HierarchyEditorActionTypes
} from "../../../../stores/hierarchyEditorStore";
import useDataApi from "../../../../hooks/useDataApi";
import { IArtifactCollector } from "../../../../interfaces/IApprovalConfig";
import genericDataFetchReducer, {
  customGenericDataFetchReducer
} from "../../../../stores/genericDataFetchReducer";
import { IXLDeployFormValues } from "../Common/XLDeployExecutionForm";
import FlexRow from "../../../../atoms/FlexRow";
import styled from "styled-components";
import { Button, LoaderButton, CancelButton } from "../../../../atoms/Button";
import { Warning, WarningContainer } from "../../../../atoms/Alerts";
import { IArtifact } from "../../../../interfaces/ILink";
import {
  ICollectorExecutionContext,
  renderCollectorRow
} from "../Common/collectorUtils";

export interface IReleaseConfig {
  artifactCollectorSpecifications: Array<IArtifactCollector>;
}

interface IReleaseConfigurationsResponse {
  isLoading: boolean;
  data: IReleaseConfig;
}

const ReleaseButtonContainer = styled(FlexRow)`
  margin: 1rem 0;

  ${Button} {
    margin: 0 1rem;

    &:first-of-type {
      margin: 0;
    }
  }
`;

const ErrorsContainer = styled.div`
  ${WarningContainer} {
    margin: 0 0 1rem;
  }
`;

const ReleaseExecutionDetailsPanel = () => {
  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );

  const [
    releaseConfigurationsResponse,
    setReleaseConfigurationsRequest
  ] = useDataApi<IReleaseConfigurationsResponse, Array<IReleaseConfig>>(
    customGenericDataFetchReducer
  );

  const [executionContexts, setExecutionContexts] = useState<
    Array<ICollectorExecutionContext>
  >([]);

  const [validateNow, setValidateNow] = useState(false);

  const [activeCollector, setActiveCollector] = useState<number>(0);
  const [collectError, setCollectorError] = useState<string | undefined>();
  const [collectorServiceApiResponse, setArtifactsRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [artifactsRequestQueue, setArtifactsRequestQueue] = useState<
    Array<ICollectorExecutionContext>
  >([]);

  const [releaseArtifacts, setReleaseArtifacts] = useState<
    Array<Array<IArtifact>>
  >([]);

  const [releaseRequestResponse, setReleaseRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [showReleaseError, setShowReleaseError] = useState(false);

  interface IReleaseRequestResponse {
    releaseIsValid: boolean;
  }

  useEffect(() => {
    if (
      releaseArtifacts.length > 0 &&
      releaseArtifacts.length === executionContexts.length
    ) {
      const releaseRequest: DataRequest = {
        method: "post",
        data: {
          releaseArtifacts
        },
        url: `/api/supplychain/${hierarchyEditorState.editor.node.referenceId}/release`,
        cbSuccess: (res: IReleaseRequestResponse) => {
          if (!res.releaseIsValid) {
            setShowReleaseError(true);
          } else {
            hierarchyEditorDispatch.editor({
              type: HierarchyEditorActionTypes.RESET
            });
          }

          setReleaseArtifacts([]);
        }
      };

      setReleaseRequest(releaseRequest);
    }

    if (artifactsRequestQueue.length > 0) {
      const modifiedArtifactsQueue = [...artifactsRequestQueue];
      const executionContext =
        artifactsRequestQueue[artifactsRequestQueue.length - 1];

      modifiedArtifactsQueue.splice(-1, 1);

      const artifactsRequest: DataRequest = {
        method: "post",
        data: {
          ...executionContext.config.context,
          ...executionContext.executionValues
        },
        url: executionContext.config.uri + "/api/collector/artifacts",
        cbSuccess: (res: Array<IArtifact>) => {
          releaseArtifacts.push(res);
          setReleaseArtifacts(releaseArtifacts);
          setArtifactsRequestQueue(modifiedArtifactsQueue);
        },
        cbFailure: (error: any) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            setCollectorError(error.response.data.message);
            return true;
          }
          return false;
        }
      };

      setArtifactsRequest(artifactsRequest);
    }
  }, [artifactsRequestQueue]);

  useEffect(() => {
    const dataRequest: DataRequest = {
      method: "get",
      url: `/api/supplychain/${hierarchyEditorState.editor.node.referenceId}/layout/releaseconfig `
    };
    setReleaseConfigurationsRequest(dataRequest);
  }, [setReleaseConfigurationsRequest]);

  useEffect(() => {
    if (
      releaseConfigurationsResponse.data &&
      releaseConfigurationsResponse.data.artifactCollectorSpecifications
    ) {
      const executionContexts: Array<ICollectorExecutionContext> = releaseConfigurationsResponse.data.artifactCollectorSpecifications.map(
        collector => {
          return {
            config: collector,
            executionValues: {} as IXLDeployFormValues,
            valid: false
          };
        }
      );

      setExecutionContexts(executionContexts);
    }
  }, [releaseConfigurationsResponse.data]);

  const onSubmit = (index: number) => {
    setActiveCollector(index + 1);
  };

  const onUpdateExecutionValues = (
    formValues: any,
    index: number,
    valid: boolean
  ): void => {
    executionContexts[index].valid = valid;
    executionContexts[index].executionValues = formValues;
    setExecutionContexts([...executionContexts]);
  };

  const handleRelease = () => {
    setArtifactsRequestQueue(executionContexts);
  };

  const onCancel = () => {
    hierarchyEditorDispatch.editor({
      type: HierarchyEditorActionTypes.RESET
    });
  };

  return (
    <Panel
      maxWidth={"37.5vw"}
      resizable={false}
      last={true}
      title={"Execute release"}>
      <ErrorsContainer>
        {collectError ? <Warning message={collectError} /> : null}
        {showReleaseError ? <Warning message={"Release has failed."} /> : null}
      </ErrorsContainer>
      <ul>
        {executionContexts.map((_executionContext, index) =>
          renderCollectorRow(
            index,
            activeCollector,
            executionContexts,
            setValidateNow,
            setActiveCollector,
            validateNow,
            onUpdateExecutionValues,
            onSubmit
          )
        )}
      </ul>
      <ReleaseButtonContainer>
        <LoaderButton
          dataTesthookId={"release-button"}
          onClick={handleRelease}
          loading={
            collectorServiceApiResponse.isLoading ||
            releaseRequestResponse.isLoading
          }
          buttonType={"button"}
          disabled={
            executionContexts.findIndex(context => !context.valid) >= 0
          }>
          Release
        </LoaderButton>
        <CancelButton onMouseDown={onCancel}>Cancel</CancelButton>
      </ReleaseButtonContainer>
    </Panel>
  );
};

export default ReleaseExecutionDetailsPanel;
