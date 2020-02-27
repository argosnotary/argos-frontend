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
import { LoaderButton } from "../../../atoms/Button";
import ContentSeparator from "../../../atoms/ContentSeparator";
import useToken from "../../../hooks/useToken";
import DataRequest from "../../../types/DataRequest";
import FormInput from "../../../molecules/FormInput";
import {
  StateContext,
  LayoutEditorDataActionTypes,
  LayoutEditorPaneActionTypes
} from "../../../stores/layoutEditorStore";
import useDataApi from "../../../hooks/useDataApi";
import genericDataFetchReducer from "../../../stores/genericDataFetchReducer";
import INpaApiResponse from "../../../interfaces/INpaApiResponse";
import PasswordView from "../../../atoms/PasswordView";

interface INpaFormValues {
  npaname: string;
}

const validate = (values: INpaFormValues) => {
  const errors = {} as any;

  if (!values.npaname) {
    errors.npaname = "Please fill in a npa name.";
  } else if (!/^([a-z]{1}[a-z0-9_]*)?$/.test(values.npaname)) {
    errors.npaname =
      "Invalid npa name (only lowercase alphanumeric characters and underscore allowed).";
  }

  return errors;
};

const ManageNpa = () => {
  const [localStorageToken] = useToken();
  const [state, dispatch] = useContext(StateContext);
  const [labelPostState, setLabelPostRequest] = useDataApi(
    genericDataFetchReducer
  );

  const postNewNpa = (values: INpaFormValues) => {
    const data: any = {};

    data.name = values.npaname;

    if (state.nodeReferenceId !== "") {
      data.parentLabelId = state.nodeReferenceId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "post",
      token: localStorageToken,
      url: "/api/nonpersonalaccount",
      cbSuccess: (npa: INpaApiResponse) => {
        dispatch({
          type: LayoutEditorDataActionTypes.POST_NEW_NPA,
          npa
        });
        formik.resetForm();
      }
    };

    setLabelPostRequest(dataRequest);
  };

  const updateNpa = (values: INpaFormValues) => {
    const data: any = {};

    data.name = values.npaname;

    if (state.nodeReferenceId !== "") {
      data.nonPersonalAccountId = state.nodeReferenceId;
    }

    if (state.nodeParentId !== "") {
      data.parentLabelId = state.nodeParentId;
    }

    const dataRequest: DataRequest = {
      data,
      method: "put",
      token: localStorageToken,
      url: `/api/nonpersonalaccount/${state.nodeReferenceId}`,
      cbSuccess: (npa: INpaApiResponse) => {
        dispatch({
          type: LayoutEditorDataActionTypes.PUT_NPA,
          npa
        });
        formik.resetForm();
      }
    };

    setLabelPostRequest(dataRequest);
  };

  const formik = useFormik({
    initialValues: {
      npaname: ""
    },
    onSubmit: values => {
      if (
        state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE
      ) {
        postNewNpa(values);
      }

      if (
        state.firstPanelView ===
        LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE
      ) {
        updateNpa(values);
      }
    },
    validate
  });

  useEffect(() => {
    if (
      state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE
    ) {
      formik.setValues({ npaname: state.selectedNodeName });
    }

    if (
      state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE
    ) {
      formik.setValues({ npaname: "" });
    }
  }, [state.selectedNodeName, state.firstPanelView]);

  const updateMode =
    state.firstPanelView === LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE;

  const renderPanelState = (state: string) => {
    switch (state) {
      case LayoutEditorPaneActionTypes.SHOW_ADD_NPA_PANE:
      case LayoutEditorPaneActionTypes.SHOW_UPDATE_NPA_PANE:
        return (
          <>
            <FormInput
              labelValue="Non personal account name*"
              name="npaname"
              formType="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.npaname}
            />
            {formik.touched.npaname && formik.errors.npaname ? (
              <InputErrorLabel>{formik.errors.npaname}</InputErrorLabel>
            ) : null}
            <ContentSeparator />
            <LoaderButton
              buttonType="submit"
              loading={labelPostState.isLoading}
            >
              {updateMode ? "Update NPA" : "Add NPA"}
            </LoaderButton>
          </>
        );
      case LayoutEditorPaneActionTypes.SHOW_NPA_PASSPHRASE:
        return <PasswordView password={"S712hjasd71j"} />;
    }
  };

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
      {renderPanelState(state.firstPanelView)}
    </form>
  );
};

export default ManageNpa;
