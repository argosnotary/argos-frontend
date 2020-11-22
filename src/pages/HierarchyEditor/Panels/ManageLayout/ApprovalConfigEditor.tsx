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
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FlexRow from "../../../../atoms/FlexRow";
import ArtifactCollectorEditor from "./ArtifactCollectorEditor";
import { useLayoutEditorStore } from "../../../../stores/LayoutEditorStore";

const CustomFlexRow = styled(FlexRow)`
  align-items: center;
`;

const ApprovalCheckbox = styled.input`
  margin-right: 1rem;
`;

const ApprovalConfigEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();
  const [approvalStep, setApprovalStep] = useState(false);

  const element = editorStoreContext.state.selectedLayoutElement;

  useEffect(() => {
    setApprovalStep(
      (element &&
        element.approvalConfig &&
        element.approvalConfig.artifactCollectorSpecifications.length > 0) ||
        false
    );
  }, [editorStoreContext.state.selectedLayoutElement]);

  if (approvalStep) {
    return (
      <ArtifactCollectorEditor
        title={"Approval collectors"}
        artifactCollectorSpecifications={
          element && element.approvalConfig
            ? element.approvalConfig.artifactCollectorSpecifications
            : []
        }
      />
    );
  } else {
    return (
      <CustomFlexRow>
        <ApprovalCheckbox
          data-testhook-id={"make-approval-step"}
          type={"checkbox"}
          checked={approvalStep}
          onChange={() => {
            setApprovalStep(true);
          }}
        />
        <label>Approval Step</label>
      </CustomFlexRow>
    );
  }
};
export default ApprovalConfigEditor;
