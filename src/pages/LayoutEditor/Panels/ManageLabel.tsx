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

import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import ContentSeparator from "../../../atoms/ContentSeparator";
import useToken from "../../../hooks/useToken";
import DataRequest from "../../../types/DataRequest";
import ILabelPostResponse from "../../../interfaces/ILabelPostResponse";
import {
  StateContext,
  LayoutEditorDataActionTypes,
  LayoutEditorPaneActionTypes,
} from "../../../stores/layoutEditorStore";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import GenericForm, {
  IGenericFormSchema,
} from "../../../organisms/GenericForm";
import { Panel } from "../../../molecules/Panel";

interface ILabelNameFormValues {
  labelname: string;
}

const formSchema: IGenericFormSchema = [
  {
    labelValue: "Label name*",
    name: "labelname",
    formType: "text",
  },
];

const validate = (values: ILabelNameFormValues) => {
  const errors = {} as any;

  if (!values.labelname) {
    errors.labelname = "Please fill in a label name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/.test(values.labelname)) {
    errors.labelname =
      "Invalid label name (only lowercase alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const ManageLabel = () => {
  const [localStorageToken] = useToken();
  const [state, dispatch] = useContext(StateContext);
  const [labelPostState, setLabelPostRequest] = useDataApi(
    genericDataFetchReducer
  );

  const [initialFormValues, setInitialFormValues] = useState(
    {} as ILabelNameFormValues
  );

  const postNewLabel = (values: ILabelNameFormValues) => {
    const data: any = {};

    data.name = values.labelname;

    if (state.nodeReferenceId !== "") {
      data.parentLabelId = state.nodeReferenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      token: localStorageToken,
      url: "/api/label",
      cbSuccess: (label: ILabelPostResponse) => {
        dispatch({
          type: LayoutEditorDataActionTypes.POST_NEW_LABEL,
          label,
        });
      },
    };

    setLabelPostRequest(dataRequest);
  };

  const updateLabel = (values: ILabelNameFormValues) => {
    const data: any = {};

    data.name = values.labelname;

    if (state.nodeReferenceId !== "") {
      data.labelId = state.nodeReferenceId;
    }

    if (state.nodeParentId !== "") {
      data.parentLabelId = state.nodeParentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      token: localStorageToken,
      url: `/api/label/${state.nodeReferenceId}`,
      cbSuccess: (label: ILabelPostResponse) => {
        dispatch({
          type: LayoutEditorDataActionTypes.PUT_LABEL,
          label,
        });
      },
    };

    setLabelPostRequest(dataRequest);
  };

  useEffect(() => {
    if (
      state.firstPanelView ===
      LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE
    ) {
      setInitialFormValues({ labelname: state.selectedNodeName });
    }

    if (
      state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE
    ) {
      setInitialFormValues({ labelname: "" });
    }
  }, [state.selectedNodeName, state.firstPanelView]);

  const updateMode =
    state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE;

  return (
    <Panel
      maxWidth={"37.5vw"}
      resizable={false}
      last={true}
      title={
        updateMode
          ? "Update selected label"
          : "Add child label to selected label"
      }
    >
      {state.selectedNodeName !== "" ? (
        <>
          <NodesBreadCrumb>
            Selected: {state.breadcrumb}
            <LastBreadCrumb>
              {state.breadcrumb.length > 0 ? " / " : ""}
              {state.selectedNodeName}
            </LastBreadCrumb>
          </NodesBreadCrumb>
          <ContentSeparator />
        </>
      ) : null}
      <GenericForm
        schema={formSchema}
        permission={state.panePermission}
        isLoading={labelPostState.isLoading}
        validate={validate}
        onCancel={() => {
          dispatch({
            type: LayoutEditorPaneActionTypes.RESET_PANE,
          });
        }}
        onSubmit={(values) => {
          if (
            state.firstPanelView ===
            LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE
          ) {
            postNewLabel(values);
          }

          if (
            state.firstPanelView ===
            LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE
          ) {
            updateLabel(values);
          }
        }}
        confirmationLabel={!updateMode ? "Add label" : "Update label"}
        cancellationLabel={"Cancel"}
        initialValues={initialFormValues}
      />
    </Panel>
  );
};

export default ManageLabel;
