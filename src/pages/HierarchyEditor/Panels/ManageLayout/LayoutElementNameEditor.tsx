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
import GenericForm, {
  IGenericFormSchema
} from "../../../../organisms/GenericForm";
import React from "react";
import { FormPermissions } from "../../../../types/FormPermission";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "./LayoutEditorStore";

interface IFormFormValues {
  name: string;
}

const segmentFormSchema: IGenericFormSchema = [
  {
    name: "name",
    formType: "text"
  }
];

interface ILayoutElementNameEditorProps {
  nameExists: (name: string) => boolean;
  currentName: string;
}

const LayoutElementNameEditor: React.FC<ILayoutElementNameEditorProps> = ({
  nameExists,
  currentName
}) => {
  const editorStoreContext = useLayoutEditorStore();

  const validateSegmentForm = (values: IFormFormValues) => {
    const errors = {} as IFormFormValues;
    if (!values.name) {
      errors.name = "Please fill in a name.";
    } else if (!/^([A-Za-z0-9_-]*)?$/.test(values.name)) {
      errors.name =
        "Invalid name (only alphanumeric characters, hyphen and underscore allowed).";
    } else if (currentName !== values.name && nameExists(values.name)) {
      errors.name = "Name should be unique.";
    }
    return errors;
  };

  const onUpdateSegmentName = (formValues: IFormFormValues) => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.UPDATE_NAME_ACTIVATE_LAYOUT_ELEMENT,
      layoutElementName: formValues.name
    });
  };

  const onCancel = () => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DEACTIVATE_LAYOUT_ELEMENT
    });
  };

  return (
    <>
      <GenericForm
        schema={segmentFormSchema}
        permission={FormPermissions.EDIT}
        isLoading={false}
        validate={validateSegmentForm}
        onCancel={onCancel}
        onSubmit={onUpdateSegmentName}
        initialValues={{ name: currentName }}
        onValidChange={onUpdateSegmentName}
        autoFocus={true}
      />
    </>
  );
};

export default LayoutElementNameEditor;
