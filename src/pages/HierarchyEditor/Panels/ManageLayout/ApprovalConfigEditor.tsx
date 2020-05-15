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
import React, { useEffect, useState, useContext } from "react";
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
import styled, { ThemeContext } from "styled-components";
import {
  CollectionContainer,
  CollectionContainerTitle,
  CollectionContainerButton,
  CollectionContainerRow,
  CollectionContainerList,
  ActionIconsContainer,
  BaseActionButton,
  CollectionContainerSpan
} from "../../../../atoms/Collection";
import { PlusIcon } from "../../../../atoms/Icons";
import EditIcon from "../../../../atoms/Icons/EditIcon";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";

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

const EditCollectionButton = styled(BaseActionButton)``;

const FormContainer = styled(CollectionContainer)`
  flex-direction: column;
  padding: 1rem;
  margin: 0 0 1rem;
  min-height: 10rem;
  background-color: ${props => props.theme.layoutBuilder.stepContainerBgColor};
`;

const RemoveCollectorButton = styled(BaseActionButton)``;

interface IFormFormValues {
  name: string;
  uri: string;
}

const approvalConfigFormSchema: IGenericFormSchema = [
  {
    labelValue: "Name",
    name: "name",
    formType: "text"
  },
  {
    labelValue: "Service URL",
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
  } else if (isWebUri(values.uri) === undefined) {
    errors.uri = "Invalid url";
  }
  return errors;
};

const ApprovalConfigEditor: React.FC = () => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

  const [collectors, setCollectors] = useState<Array<IArtifactCollector>>([]);
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    setEditIndex(undefined);
    setAddMode(false);
    if (editorStoreContext.state.selectedLayoutElement?.approvalConfig) {
      setCollectors([
        ...editorStoreContext.state.selectedLayoutElement?.approvalConfig
          .artifactCollectorSpecifications
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
      <FormContainer>
        <GenericForm
          dataTesthookId={"collector-edit-form"}
          schema={approvalConfigFormSchema}
          permission={FormPermissions.EDIT}
          isLoading={false}
          validate={validateApprovalConfigForm}
          onCancel={onCancel}
          onSubmit={form => onUpdateApprovalConfig(form, collector)}
          initialValues={{ name: collector.name, uri: collector.uri }}
          cancellationLabel={"Cancel"}
          confirmationLabel={"Save"}
          autoFocus={true}
        />
      </FormContainer>
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
      <CollectorContainerSection>
        <CollectorTitle>
          <CollectionContainerSpan>
            {collector.name} - {collector.type.toLowerCase()} - {collector.uri}
          </CollectionContainerSpan>
          <ActionIconsContainer>
            <EditCollectionButton
              data-testhook-id={"edit-collector-" + index}
              onClick={() => setEditIndex(index)}>
              <EditIcon size={26} color={theme.layoutBuilder.iconColor} />
            </EditCollectionButton>
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

  return (
    <CollectorsContainer>
      <CollectionContainerRow>
        <CollectorsContainerTitle>Approval collectors</CollectorsContainerTitle>
        {editIndex === undefined ? (
          <AddCollectorButton
            data-testhook-id={"add-collector"}
            onClick={addCollector}>
            <PlusIcon size={24} color={theme.layoutBuilder.iconColor} />
          </AddCollectorButton>
        ) : null}
      </CollectionContainerRow>
      <CollectionContainerList>
        {collectors.map((collector, index) => {
          return (
            <li key={"collector-row-" + index}>
              {index === editIndex
                ? editorForm(collector)
                : collectorRow(collector, index)}
            </li>
          );
        })}
      </CollectionContainerList>
    </CollectorsContainer>
  );
};

export default ApprovalConfigEditor;
