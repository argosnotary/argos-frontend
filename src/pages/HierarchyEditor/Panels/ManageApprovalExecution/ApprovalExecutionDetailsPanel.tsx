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
import React, { useState } from "react";
import { Panel } from "../../../../molecules/Panel";
import {
  ArtifactCollectorType,
  IApprovalConfig
} from "../../../../interfaces/IApprovalConfig";
import { useApprovalExecutionStore } from "../../../../stores/ApprovalExecutionStore";

const ApprovalExecutionDetailsPanel: React.FC = () => {
  const _approvalContext = useApprovalExecutionStore();

  //const approvalConfig = approvalContext.state.selectedApprovalConfig;
  const approvalConfig: IApprovalConfig = {
    stepName: "stepName",
    segmentName: "segmentName",
    artifactCollectorSpecifications: [
      {
        type: ArtifactCollectorType.XLDEPLOY,
        name: "collector 1",
        uri: "https://someservice",
        context: {
          applicationName: "app name"
        }
      },
      {
        type: ArtifactCollectorType.XLDEPLOY,
        name: "collector 2",
        uri: "https://someservice2",
        context: {
          applicationName: "app name"
        }
      }
    ]
  };

  const [activeCollector, setActiveCollector] = useState<number>(0);

  if (approvalConfig) {
    return (
      <Panel
        width={"37.5vw"}
        last={true}
        title={
          "approve " +
          approvalConfig.segmentName +
          " - " +
          approvalConfig.stepName
        }>
        <ul>
          {approvalConfig.artifactCollectorSpecifications.map(
            (collector, index) => {
              return (
                <li key={index}>
                  <div onClick={() => setActiveCollector(index)}>
                    header for {collector.name}
                  </div>

                  {activeCollector === index ? (
                    <>
                      <div>active</div>
                    </>
                  ) : (
                    <>
                      <div>not active</div>
                    </>
                  )}
                </li>
              );
            }
          )}
        </ul>
      </Panel>
    );
  }
  return (
    <Panel width={"37.5vw"} last={true} title="">
      <div />
    </Panel>
  );
};

export default ApprovalExecutionDetailsPanel;
