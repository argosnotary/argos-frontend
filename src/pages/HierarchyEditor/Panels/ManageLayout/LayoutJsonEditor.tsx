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
import React, { useContext, useEffect, useState } from "react";
import { cryptoAvailable } from "../../../../security";
import { FormPermissions } from "../../../../types/FormPermission";
import {
  HierarchyEditorPaneActionTypes,
  StateContext
} from "../../../../stores/hierarchyEditorStore";
import GenericForm, {
  IGenericFormSchema
} from "../../../../organisms/GenericForm";
import {
  LayoutEditorActionType,
  useLayoutEditorStore
} from "./LayoutEditorStore";
import DataRequest from "../../../../types/DataRequest";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import { ILayoutValidationMessage } from "../../../../interfaces/ILayout";
import { useUserProfileContext } from "../../../../stores/UserProfile";

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
  const [state, dispatch] = useContext(StateContext);

  const [layoutJson, setLayoutJson] = useState<string>("{}");

  const editorStoreContext = useLayoutEditorStore();

  const [responseLayoutValidation, setLayoutValidationDataRequest] = useDataApi(
    genericDataFetchReducer
  );

  useEffect(() => {
    setLayoutJson(JSON.stringify(editorStoreContext.state.layout, null, 2));
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
      url: "/api/supplychain/" + state.nodeReferenceId + "/layout/validate",
      cbSuccess: () => {
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.START_SIGNING
        });
      },
      cbFailure: (error: any): boolean => {
        const response: ILayoutValidationErrorResponse = error.response.data;
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.LAYOUT_HAS_VALIDATION_ERRORS,
          validationErrors: response.messages
        });
        return true;
      }
    };

    setLayoutValidationDataRequest(dataRequest);
  };

  return (
    <GenericForm
      schema={formSchema}
      permission={
        cryptoAvailable() ? state.panePermission : FormPermissions.READ
      }
      isLoading={editorStoreContext.state.loading}
      validate={validateLayout}
      onCancel={() => {
        dispatch({
          type: HierarchyEditorPaneActionTypes.RESET_PANE
        });
      }}
      onSubmit={values => {
        requestLayoutValidation(values);
      }}
      confirmationLabel={"Sign and Submit"}
      cancellationLabel={"Cancel"}
      initialValues={{ layout: layoutJson }}
      onValidChange={values =>
        editorStoreContext.dispatch({
          type: LayoutEditorActionType.UPDATE_LAYOUT,
          layout: JSON.parse(values.layout)
        })
      }
    />
  );
};

export default LayoutJsonEditor;
