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
import React, { useEffect, useState } from "react";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "./LayoutEditorStore";
import GenericForm, {
  IGenericFormSchema
} from "../../../../organisms/GenericForm";
import { FormPermissions } from "../../../../types/FormPermission";
import {
  ArtifactCollectorType,
  IArtifactCollector
} from "../../../../interfaces/IApprovalConfig";
import { isWebUri } from "valid-url";

interface IFormFormValues {
  name: string;
  uri: string;
}

const approvalConfigFormSchema: IGenericFormSchema = [
  {
    name: "name",
    formType: "text"
  },
  {
    name: "uri",
    formType: "text"
  }
];

const validateApprovalConfigForm = (values: IFormFormValues) => {
  const errors = {} as IFormFormValues;
  if (!values.name) {
    errors.name = "Please fill in a name.";
  } else if (!/^([A-Za-z0-9_-]*)?$/.test(values.name)) {
    errors.name =
      "Invalid name (only alphanumeric characters, hyphen and underscore allowed).";
  }

  if (!values.uri) {
    errors.uri = "Please fill in a url.";
    //eslint-disable-next-line
  } else if (isWebUri(values.uri) === undefined) {
    errors.uri = "Invalid url";
  }
  return errors;
};

const ApprovalConfigEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

  const [collectors, setCollectors] = useState<Array<IArtifactCollector>>([]);
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    setEditIndex(undefined);
    setAddMode(false);
    if (editorStoreContext.state.selectedLayoutElement?.approvalConfig) {
      setCollectors([
        ...editorStoreContext.state.selectedLayoutElement?.approvalConfig
          .artifactCollectors
      ]);
    } else {
      setCollectors([]);
    }
  }, [editorStoreContext.state.selectedLayoutElement]);

  const onUpdateApprovalConfig = (
    formValues: any,
    artifactCollector: IArtifactCollector
  ): void => {
    artifactCollector.uri = formValues.uri;
    artifactCollector.name = formValues.name;
    if (addMode) {
      editorStoreContext.dispatch({
        type: LayoutEditorActionType.ADD_ARTIFACT_COLLECTOR,
        artifactCollector: artifactCollector
      });
      setAddMode(false);
    } else {
      editorStoreContext.dispatch({
        type: LayoutEditorActionType.UPDATE_ARTIFACT_COLLECTOR,
        artifactCollector: artifactCollector
      });
    }
  };

  const onCancel = () => {
    if (addMode) {
      collectors.splice(collectors.length - 1, 1);
      setCollectors(collectors);
    }
    setEditIndex(undefined);
  };

  const addCollector = () => {
    collectors.push({
      type: ArtifactCollectorType.XLDEPLOY,
      name: "",
      uri: ""
    });
    setCollectors(collectors);
    setEditIndex(collectors.length - 1);
    setAddMode(true);
  };

  const editorForm = (collector: IArtifactCollector) => {
    return (
      <>
        <GenericForm
          schema={approvalConfigFormSchema}
          permission={FormPermissions.EDIT}
          isLoading={false}
          validate={validateApprovalConfigForm}
          onCancel={onCancel}
          onSubmit={form => onUpdateApprovalConfig(form, collector)}
          initialValues={{ name: collector.name, uri: collector.uri }}
          cancellationLabel={"Cancel"}
          confirmationLabel={"Save"}
        />
      </>
    );
  };

  const deleteCollector = (index: number) => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DELETE_ARTIFACT_COLLECTOR,
      artifactCollector: collectors[index]
    });
  };

  const collectorRow = (collector: IArtifactCollector, index: number) => {
    return (
      <>
        <div key={index}>
          {collector.name}
          {collector.type}
          {collector.uri}
          <button
            onClick={() => {
              setEditIndex(index);
            }}
          >
            edit
          </button>
          <button onClick={() => deleteCollector(index)}>delete</button>
        </div>
      </>
    );
  };

  return (
    <>
      {editIndex === undefined ? (
        <div>
          <button onClick={addCollector}>add</button>
        </div>
      ) : null}
      {collectors.map((collector, index) => {
        return (
          <>
            {index === editIndex
              ? editorForm(collector)
              : collectorRow(collector, index)}
          </>
        );
      })}
    </>
  );
};

export default ApprovalConfigEditor;
