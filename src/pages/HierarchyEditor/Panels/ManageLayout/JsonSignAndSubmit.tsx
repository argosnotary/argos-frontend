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
import React, { useContext } from "react";
import FlexRow from "../../../../atoms/FlexRow";
import { LoaderButton } from "../../../../atoms/Button";
import { CustomCancelButton } from "../../../../atoms/SearchInput";
import {
  HierarchyEditorStateContext,
  HierarchyEditorActionTypes
} from "../../../../stores/hierarchyEditorStore";
import {
  useLayoutEditorStore,
  LayoutEditorActionType
} from "../../../../stores/LayoutEditorStore";
import useDataApi from "../../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../../stores/genericDataFetchReducer";
import DataRequest from "../../../../types/DataRequest";
import { ILayoutValidationMessage } from "../../../../interfaces/ILayout";

interface ILayoutValidationErrorResponse {
  messages: Array<ILayoutValidationMessage>;
}

interface ILayoutFormValues {
  layout: string;
}

const JsonSignAndSubmit = () => {
  const [hierarchyEditorState, hierarchyEditorDispatch] = useContext(
    HierarchyEditorStateContext
  );

  const editorStoreContext = useLayoutEditorStore();

  const [responseLayoutValidation, setLayoutValidationDataRequest] = useDataApi(
    genericDataFetchReducer
  );

  const handleCancel = () => {
    hierarchyEditorDispatch.editor({
      type: HierarchyEditorActionTypes.RESET
    });
  };

  const requestLayoutValidation = (values: ILayoutFormValues) => {
    const dataRequest: DataRequest = {
      data: values.layout,
      method: "post",
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
    <FlexRow>
      <LoaderButton
        dataTesthookId={"layout-json-form-submit-button"}
        buttonType="button"
        loading={responseLayoutValidation.isLoading}
        onClick={() =>
          requestLayoutValidation({
            layout: JSON.stringify(editorStoreContext.state.layout)
          })
        }>
        Sign and Submit
      </LoaderButton>
      <CustomCancelButton
        data-testhook="cancel-button"
        type="button"
        onMouseDown={handleCancel}>
        Cancel
      </CustomCancelButton>
    </FlexRow>
  );
};

export default JsonSignAndSubmit;
