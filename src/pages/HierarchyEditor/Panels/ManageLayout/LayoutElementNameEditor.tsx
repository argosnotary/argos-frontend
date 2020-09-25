/*
 * Copyright (C) 2020 Argos Notary Coöperatie UA
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
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import React, { useEffect } from "react";
import { FormPermissions } from "../../../../types/FormPermission";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../../../../hooks/useFormBuilder";

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
  dataTesthookId?: string;
}

const LayoutElementNameEditor: React.FC<ILayoutElementNameEditorProps> = ({
  nameExists,
  currentName,
  dataTesthookId
}) => {
  const editorStoreContext = useLayoutEditorStore();

  const validateSegmentForm = (values: IFormFormValues) => {
    const errors = {} as IFormFormValues;
    if (!values.name) {
      errors.name = "Please fill in a name.";
    } else if (!/^([a-z]|[a-z][a-z0-9-]*[a-z0-9])?$/.test(values.name)) {
      errors.name =
        "Invalid name (only lowercase alphanumeric characters and hyphen allowed).";
    } else if (currentName !== values.name && nameExists(values.name)) {
      errors.name = "Name should be unique.";
    }
    return errors;
  };

  const onUpdateSegmentName = (valid: boolean, formValues: IFormFormValues) => {
    if (valid) {
      editorStoreContext.dispatch({
        type: LayoutEditorActionType.UPDATE_NAME_ACTIVATE_LAYOUT_ELEMENT,
        layoutElementName: formValues.name
      });
    }
  };

  const onCancel = () => {
    editorStoreContext.dispatch({
      type: LayoutEditorActionType.DEACTIVATE_LAYOUT_ELEMENT
    });
  };

  const formConfig: IFormBuilderConfig = {
    dataTesthookId,
    schema: segmentFormSchema,
    permission: FormPermissions.EDIT,
    isLoading: false,
    validate: validateSegmentForm,
    onCancel,
    onSubmit: form => onUpdateSegmentName(true, form),
    onChange: onUpdateSegmentName,
    autoFocus: true,
    buttonHandler: FormSubmitButtonHandlerTypes.CLICK
  };

  const [formJSX, formAPI] = useFormBuilder(formConfig);

  useEffect(() => {
    formAPI.setInitialFormValues({ name: currentName });
  }, [currentName]);

  return <>{formJSX}</>;
};

export default LayoutElementNameEditor;
