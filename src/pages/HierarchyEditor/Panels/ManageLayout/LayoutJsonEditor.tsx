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
import { cryptoAvailable } from "../../../../security";
import { FormPermissions } from "../../../../types/FormPermission";
import { IGenericFormSchema } from "../../../../interfaces/IGenericFormSchema";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "../../../../stores/LayoutEditorStore";
import DataRequest from "../../../../types/DataRequest";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import { ILayoutValidationMessage } from "../../../../interfaces/ILayout";
import { useUserProfileContext } from "../../../../stores/UserProfile";
import {
  HierarchyEditorStateContext,
  HierarchyEditorActionTypes
} from "../../../../stores/hierarchyEditorStore";
import useFormBuilder, {
  IFormBuilderConfig,
  FormSubmitButtonHandlerTypes
} from "../../../../hooks/useFormBuilder";

interface ILayoutValidationErrorResponse {
  messages: Array<ILayoutValidationMessage>;
}

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

  const [responseLayoutValidation, setLayoutValidationDataRequest] = useDataApi(
    genericDataFetchReducer
  );

  const formConfig: IFormBuilderConfig = {
    dataTesthookId: "layout-json-form",
    schema: formSchema,
    permission: cryptoAvailable()
      ? hierarchyEditorState.editor.permission
      : FormPermissions.READ,
    isLoading: editorStoreContext.state.loading,
    validate: validateLayout,
    onCancel: () => {
      hierarchyEditorDispatch.editor({
        type: HierarchyEditorActionTypes.RESET
      });
    },
    onSubmit: values => {
      requestLayoutValidation(values);
    },
    onChange: (valid, values) => {
      if (valid) {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.UPDATE_LAYOUT,
          layout: JSON.parse(values.layout)
        });
      }
    },
    confirmationLabel: "Sign and Submit",
    cancellationLabel: "Cancel",
    buttonHandler: FormSubmitButtonHandlerTypes.CLICK
  };

  const [formJSX, formApi] = useFormBuilder(formConfig);

  useEffect(() => {
    formApi.setInitialFormValues({
      layout: JSON.stringify(editorStoreContext.state.layout, null, 2)
    });
  }, [editorStoreContext.state.layout]);

  useEffect(() => {
    editorStoreContext.dispatch({
      type: responseLayoutValidation.isLoading
        ? LayoutEditorActionType.START_LOADING
        : LayoutEditorActionType.END_LOADING
    });
  }, [responseLayoutValidation.isLoading]);

  const { token } = useUserProfileContext();

  const requestLayoutValidation = (values: ILayoutFormValues) => {
    const dataRequest: DataRequest = {
      data: values.layout,
      method: "post",
      token: token,
      url:
        "/api/supplychain/" +
        hierarchyEditorState.editor.node.referenceId +
        "/layout/validate",
      cbSuccess: () => {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.START_SIGNING
        });
      },
      cbFailure: (error: any): boolean => {
        const response: ILayoutValidationErrorResponse = error.response.data;

        if (formApi.isValid) {
          editorStoreContext.dispatch({
            type: LayoutEditorActionType.UPDATE_LAYOUT,
            layout: JSON.parse(values.layout)
          });
        }

        editorStoreContext.dispatch({
          type: LayoutEditorActionType.LAYOUT_HAS_VALIDATION_ERRORS,
          validationErrors: response.messages
        });
        return true;
      }
    };

    setLayoutValidationDataRequest(dataRequest);
  };

  return <>{formJSX}</>;
};

export default LayoutJsonEditor;
