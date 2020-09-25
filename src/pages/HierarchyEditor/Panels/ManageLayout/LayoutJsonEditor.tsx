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
import React, { useContext, useEffect } from "react";
import { cryptoAvailable } from "../../../../security";
import { FormPermissions } from "../../../../types/FormPermission";
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import {
  HierarchyEditorStateContext,
  HierarchyEditorActionTypes
} from "../../../../stores/hierarchyEditorStore";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../../../../hooks/useFormBuilder";

const formSchema: IGenericFormSchema = [
  {
    labelValue: "Layout*",
    name: "layout",
    formType: "textArea"
  }
];

interface ILayoutFormValues {
  layout: string;
}

const validateLayout = (values: ILayoutFormValues) => {
  const errors = {} as ILayoutFormValues;

  if (!values.layout) {
    errors.layout = "Please fill in a layout.";
  } else {
    try {
      JSON.parse(values.layout);
    } catch (e) {
      errors.layout = "Invalid json " + e;
    }
  }
  return errors;
};

const LayoutJsonEditor: React.FC = () => {
  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );

  const editorStoreContext = useLayoutEditorStore();

  const handleCancel = () => {
    hierarchyEditorDispatch.editor({
      type: HierarchyEditorActionTypes.RESET
    });
  };

  const formConfig: IFormBuilderConfig = {
    dataTesthookId: "layout-json-form",
    schema: formSchema,
    permission: cryptoAvailable()
      ? hierarchyEditorState.editor.permission
      : FormPermissions.READ,
    isLoading: editorStoreContext.state.loading,
    validate: validateLayout,
    onCancel: handleCancel,
    onSubmit: () => {
      return;
    },
    onChange: (valid, values) => {
      if (valid) {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.UPDATE_LAYOUT,
          layout: JSON.parse(values.layout)
        });
      }
    },
    buttonHandler: FormSubmitButtonHandlerTypes.CLICK
  };

  const [formJSX, formApi] = useFormBuilder(formConfig);

  useEffect(() => {
    formApi.setInitialFormValues({
      layout: JSON.stringify(editorStoreContext.state.layout, null, 2)
    });
  }, [
    editorStoreContext.state.layout,
    editorStoreContext.state.layout.expectedEndProducts,
    editorStoreContext.state.layout.authorizedKeyIds,
    editorStoreContext.state.selectedLayoutElement?.step?.requiredNumberOfLinks,
    editorStoreContext.state.layout.authorizedKeyIds,
    editorStoreContext.state.selectedLayoutElement?.step?.expectedProducts,
    editorStoreContext.state.selectedLayoutElement?.step?.expectedMaterials,
    editorStoreContext.state.selectedLayoutElement?.step?.authorizedKeyIds
  ]);

  return <>{editorStoreContext.state.showJson ? formJSX : null}</>;
};

export default LayoutJsonEditor;
