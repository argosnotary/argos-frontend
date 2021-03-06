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
import { FormPermissions } from "../../../../types/FormPermission";
import {
  ArtifactCollectorType,
  IArtifactCollector,
  IGitContext,
  IXLDeployContext
} from "../../../../interfaces/IApprovalConfig";
import { isWebUri } from "valid-url";
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
import { PlusIcon } from "../../../../atoms/Icons";
import EditIcon from "../../../../atoms/Icons/EditIcon";
import RemoveIcon from "../../../../atoms/Icons/RemoveIcon";
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../../../../hooks/useFormBuilder";
import Select, { SelectionContainer } from "../../../../atoms/Select";

const CollectorsContainer = styled(CollectionContainer)``;

const CollectorsContainerTitle = styled(CollectionContainerTitle)``;

const AddCollectorButton = styled(CollectionContainerButton)``;

const CollectorTitle = styled(CollectionContainerCard)``;

const CollectorContainerSection = styled.section`
  width: 100%;
`;

const EditCollectionButton = styled(BaseActionButton)``;

export const FormContainer = styled(CollectionContainer)`
  margin: 0;
  padding: 0;
  border: 0;
  flex-direction: column;
  min-height: 10rem;
  background-color: ${props => props.theme.layoutBuilder.stepContainerBgColor};
`;

const RemoveCollectorButton = styled(BaseActionButton)``;

interface IFormFormValues {
  name: string;
  uri: string;
  applicationName?: string;
  repository?: string;
}

const defaultApprovalConfigFormSchema: IGenericFormSchema = [
  {
    labelValue: "Name*",
    name: "name",
    formType: "text"
  },
  {
    labelValue: "Service URL*",
    name: "uri",
    formType: "text"
  }
];

const getApprovalConfigFormSchema = (
  type: ArtifactCollectorType | "select"
): IGenericFormSchema => {
  if (type === ArtifactCollectorType.XLDEPLOY) {
    return [
      ...defaultApprovalConfigFormSchema,
      {
        labelValue: "Application Name*",
        name: "applicationName",
        formType: "text"
      }
    ];
  } else if (type === ArtifactCollectorType.GIT) {
    return [
      ...defaultApprovalConfigFormSchema,
      {
        labelValue: "Repository path*",
        name: "repository",
        formType: "text"
      }
    ];
  }

  return [];
};

const validateApprovalConfigForm = (
  values: IFormFormValues,
  type: ArtifactCollectorType | "select"
) => {
  const errors = {} as IFormFormValues;
  if (!values.name) {
    errors.name = "Please fill in a name.";
  } else if (!/^([a-z]|[a-z][a-z0-9-]*[a-z0-9])?$/.test(values.name)) {
    errors.name =
      "Invalid name (only alphanumeric characters and hyphen allowed).";
  }

  if (!values.uri) {
    errors.uri = "Please fill in a url.";
  } else if (isWebUri(values.uri) === undefined) {
    errors.uri = "Invalid url";
  }

  if (type === ArtifactCollectorType.XLDEPLOY) {
    if (!values.applicationName) {
      errors.applicationName = "Please fill in a application name.";
    } else if (
      !new RegExp("^[^\\\\/\\]\\[:|,*]+$").test(values.applicationName)
    ) {
      errors.applicationName =
        "Please enter only valid characters for the application name (no `/`, `\\`, `:`, `[`, `]`, `|`, `,` or `*`)";
    }
  } else if (type === ArtifactCollectorType.GIT) {
    if (!values.repository) {
      errors.repository = "Please fill in a repository path.";
    } else if (!new RegExp("^[A-Za-z0-9_.\\-/]*$").test(values.repository)) {
      errors.repository = "Please enter a valid repository path.";
    }
  }
  return errors;
};

const getInitialValues = (
  collector: IArtifactCollector
): IFormFormValues | {} => {
  if (collector.type === ArtifactCollectorType.XLDEPLOY) {
    return {
      name: collector.name,
      uri: collector.uri,
      applicationName: (collector.context as IXLDeployContext).applicationName
    };
  } else if (collector.type === ArtifactCollectorType.GIT) {
    return {
      name: collector.name,
      uri: collector.uri,
      repository: (collector.context as IGitContext).repository
    };
  }
  return {};
};

interface IArtifactCollectorEditorProps {
  title: string;
  artifactCollectorSpecifications: Array<IArtifactCollector>;
}

const ArtifactCollectorEditor: React.FC<IArtifactCollectorEditorProps> = ({
  title,
  artifactCollectorSpecifications
}) => {
  const editorStoreContext = useLayoutEditorStore();

  const theme = useContext(ThemeContext);

  const [editIndex, setEditIndex] = useState<number | undefined>(undefined);

  const [collectors, setCollectors] = useState<Array<IArtifactCollector>>([]);
  const [addMode, setAddMode] = useState(false);

  const [selectedCollectorType, setSelectedCollectorType] = useState<
    ArtifactCollectorType | "select"
  >("select");

  useEffect(() => {
    setEditIndex(undefined);
    setAddMode(false);
    setCollectors([...artifactCollectorSpecifications]);
  }, [artifactCollectorSpecifications]);

  useEffect(() => {
    if (editIndex !== undefined && collectors[editIndex] !== undefined) {
      if (collectors[editIndex].type !== undefined) {
        setSelectedCollectorType(collectors[editIndex].type);
      } else {
        setSelectedCollectorType("select");
      }
    }
  }, [editIndex]);

  const onUpdateApprovalConfig = (
    formValues: IFormFormValues,
    artifactCollector: IArtifactCollector
  ): void => {
    artifactCollector.uri = formValues.uri;
    artifactCollector.name = formValues.name;
    artifactCollector.type = selectedCollectorType as ArtifactCollectorType;

    if (artifactCollector.type === ArtifactCollectorType.XLDEPLOY) {
      artifactCollector.context = {
        applicationName: formValues.applicationName || ""
      };
    } else if (artifactCollector.type === ArtifactCollectorType.GIT) {
      artifactCollector.context = {
        repository: formValues.repository || ""
      };
    }

    if (addMode) {
      editorStoreContext.dispatch({
        type: LayoutEditorActionType.ADD_ARTIFACT_COLLECTOR,
        artifactCollector
      });
    } else {
      setEditIndex(undefined);
      editorStoreContext.dispatch({
        type: LayoutEditorActionType.UPDATE_ARTIFACT_COLLECTOR,
        artifactCollector
      });
    }
  };

  const onCancel = () => {
    if (addMode) {
      collectors.splice(collectors.length - 1, 1);
      setCollectors([...collectors]);
    }
    setEditIndex(undefined);
  };

  const addCollector = () => {
    collectors.push({} as IArtifactCollector);
    setCollectors([...collectors]);
    setAddMode(true);
    setEditIndex(collectors.length - 1);
  };

  const selectCollectorType = (e: any) => {
    setSelectedCollectorType(e.target.value);
  };

  const EditorForm: React.FC<{ collector: IArtifactCollector }> = ({
    collector
  }) => {
    const formConfig: IFormBuilderConfig = {
      dataTesthookId: "collector-edit-form",
      schema: getApprovalConfigFormSchema(selectedCollectorType),
      permission: FormPermissions.EDIT,
      isLoading: false,
      validate: values =>
        validateApprovalConfigForm(values, selectedCollectorType),
      onCancel,
      onSubmit: form => onUpdateApprovalConfig(form, collector),
      cancellationLabel: "Cancel",
      confirmationLabel: "Save",
      autoFocus: true,
      buttonHandler: FormSubmitButtonHandlerTypes.MOUSEDOWN,
      alternateStyling: true
    };

    const [formJSX, formAPI] = useFormBuilder(formConfig);

    useEffect(() => {
      const initialValues = getInitialValues(collector) as {};
      formAPI.setInitialFormValues(initialValues);
    }, [collector]);

    return (
      <>
        <SelectionContainer>
          <label htmlFor="collectorType">Collector type:</label>
          <Select
            onChange={selectCollectorType}
            value={selectedCollectorType}
            name="collectorType"
            id="collectorType">
            <option value={"select"}>select...</option>
            <option value={ArtifactCollectorType.XLDEPLOY}>XL deploy</option>
            <option value={ArtifactCollectorType.GIT}>git</option>
          </Select>
        </SelectionContainer>
        {selectedCollectorType !== "select" ? (
          <FormContainer>{formJSX} </FormContainer>
        ) : null}
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
        {collector.name ? (
          <CollectorContainerSection>
            <CollectorTitle clickable={false}>
              <CollectionContainerSpan>
                {collector.name} - {collector.type.toLowerCase()} -{" "}
                {collector.uri}
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
        ) : null}
      </>
    );
  };

  return (
    <CollectorsContainer>
      <CollectionContainerRow>
        <CollectorsContainerTitle>{title}</CollectorsContainerTitle>
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
              {index === editIndex ? (
                <EditorForm collector={collector} />
              ) : (
                collectorRow(collector, index)
              )}
            </li>
          );
        })}
      </CollectionContainerList>
    </CollectorsContainer>
  );
};

export default ArtifactCollectorEditor;
