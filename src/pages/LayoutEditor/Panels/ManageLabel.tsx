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
import { useFormik } from "formik";

import { NodesBreadCrumb, LastBreadCrumb } from "../../../atoms/Breadcrumbs";
import InputErrorLabel from "../../../atoms/InputErrorLabel";
import { LoaderButton, CancelButton } from "../../../atoms/Button";
import ContentSeparator from "../../../atoms/ContentSeparator";
import useToken from "../../../hooks/useToken";
import DataRequest from "../../../types/DataRequest";
import ILabelPostResponse from "../../../interfaces/ILabelPostResponse";
import FormInput from "../../../molecules/FormInput";
import {
  StateContext,
  LayoutEditorDataActionTypes,
  LayoutEditorPaneActionTypes
} from "../../../stores/layoutEditorStore";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";

interface ILabelNameFormValues {
  labelname: string;
}

const validate = (values: ILabelNameFormValues) => {
  const errors = {} as any;

  if (!values.labelname) {
    errors.labelname = "Please fill in a label name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/i.test(values.labelname)) {
    errors.labelname =
      "Invalid label name (only alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const ManageLabel = () => {
  const [localStorageToken] = useToken();
  const [state, dispatch] = useContext(StateContext);
  const [labelPostState, setLabelPostRequest] = useDataApi(
    genericDataFetchReducer
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
          label
        });
        formik.resetForm();
      }
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
          label
        });
        formik.resetForm();
      }
    };

    setLabelPostRequest(dataRequest);
  };

  const formik = useFormik({
    initialValues: {
      labelname: ""
    },
    onSubmit: values => {
      if (
        state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE
      ) {
        postNewLabel(values);
      }

      if (
        state.firstPanelView ===
        LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE
      ) {
        updateLabel(values);
      }
    },
    validate
  });

  useEffect(() => {
    if (
      state.firstPanelView ===
      LayoutEditorPaneActionTypes.SHOW_UPDATE_LABEL_PANE
    ) {
      formik.setValues({ labelname: state.selectedNodeName });
    }

    if (
      state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_ADD_LABEL_PANE
    ) {
      formik.setValues({ labelname: "" });
    }
  }, [state.selectedNodeName, state.firstPanelView]);

  return (
    <form onSubmit={formik.handleSubmit}>
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
      <FormInput
        labelValue="Label name*"
        name="labelname"
        formType="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.labelname}
      />
      {formik.touched.labelname && formik.errors.labelname ? (
        <InputErrorLabel>{formik.errors.labelname}</InputErrorLabel>
      ) : null}
      <ContentSeparator />
      <LoaderButton buttonType="submit" loading={labelPostState.isLoading}>
        Add label
      </LoaderButton>
      <CancelButton
        onClick={() =>
          dispatch({
            type: LayoutEditorPaneActionTypes.RESET_PANE
          })
        }
      >
        Cancel
      </CancelButton>
    </form>
  );
};

export default ManageLabel;
